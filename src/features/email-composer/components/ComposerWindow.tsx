"use client";

import { useEffect, useMemo, useState, type KeyboardEvent } from "react";
import { EditorContent } from "@tiptap/react";
import { FileText, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { TooltipProvider } from "@/shared/ui/tooltip";
import {
  useContactSuggestions,
  useEmailSignatures,
  useEmailTemplates,
  useSuppressedEmails,
} from "../api/useComposerResources";
import { useSendingAccounts } from "../api/useSendingAccounts";
import { useAutosaveDraft } from "../hooks/useAutosaveDraft";
import { useComposerEditor } from "../hooks/useComposerEditor";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { useMergeTagSuggestion } from "../hooks/useMergeTagSuggestion";
import { createId } from "../lib/createId";
import { runDeliverabilityChecks } from "../lib/deliverability";
import {
  applyLink,
  insertImageByUrl,
  replaceWithSanitisedHtml,
} from "../lib/editorCommands";
import { resolveBrowserTimeZone } from "../lib/scheduleOptions";
import { useEmailComposerStore } from "../store/emailComposer.store";
import type {
  ComposerSession,
  EmailRecipient,
  EmailRecipientField,
  EmailTemplateSummary,
} from "../types/emailComposer.types";
import ComposerActions from "./ComposerActions";
import ComposerAttachments from "./ComposerAttachments";
import ComposerFromRow from "./ComposerFromRow";
import ComposerHeader from "./ComposerHeader";
import ComposerSignatureBlock from "./ComposerSignatureBlock";
import ComposerSubjectRow from "./ComposerSubjectRow";
import ComposerToolbar from "./ComposerToolbar";
import MergeTagSuggestionList from "./MergeTagSuggestionList";
import RecipientField from "./RecipientField";

export interface ComposerWindowProps {
  readonly session: ComposerSession;
  readonly workspaceSlug: string;
  readonly onSend: (session: ComposerSession, fromAddress: string) => void;
  readonly onDiscard: (session: ComposerSession) => void;
}

const SEARCH_DEBOUNCE_MS = 180;
const SAVED_LABEL_TICK_MS = 15_000;

const ComposerWindow = ({
  session,
  workspaceSlug,
  onSend,
  onDiscard,
}: ComposerWindowProps) => {
  const { draft } = session;

  const closeComposer = useEmailComposerStore((state) => state.closeComposer);
  const setWindowState = useEmailComposerStore((state) => state.setWindowState);
  const toggleToolbar = useEmailComposerStore((state) => state.toggleToolbar);
  const setFieldVisible = useEmailComposerStore(
    (state) => state.setFieldVisible,
  );
  const patchDraft = useEmailComposerStore((state) => state.patchDraft);
  const addRecipients = useEmailComposerStore((state) => state.addRecipients);
  const removeRecipient = useEmailComposerStore(
    (state) => state.removeRecipient,
  );
  const addAttachment = useEmailComposerStore((state) => state.addAttachment);
  const removeAttachment = useEmailComposerStore(
    (state) => state.removeAttachment,
  );

  const accountsQuery = useSendingAccounts(workspaceSlug);
  const signaturesQuery = useEmailSignatures(workspaceSlug);
  const templatesQuery = useEmailTemplates(workspaceSlug);
  const suppressionQuery = useSuppressedEmails(workspaceSlug);

  const [recipientQuery, setRecipientQuery] = useState("");
  const debouncedQuery = useDebouncedValue(recipientQuery, SEARCH_DEBOUNCE_MS);
  const suggestionsQuery = useContactSuggestions(workspaceSlug, debouncedQuery);

  const [now, setNow] = useState(() => new Date());
  const timeZone = useMemo(() => resolveBrowserTimeZone(), []);

  const accounts = useMemo(
    () => accountsQuery.data ?? [],
    [accountsQuery.data],
  );
  const signatures = signaturesQuery.data ?? [];
  const templates = templatesQuery.data ?? [];
  const suppressedEmails = useMemo(
    () => suppressionQuery.data ?? [],
    [suppressionQuery.data],
  );

  const selectedAccount =
    accounts.find((account) => account.id === draft.fromAccountId) ?? null;
  const activeSignature =
    signatures.find((signature) => signature.id === draft.signatureId) ?? null;

  const mergeTagSuggestion = useMergeTagSuggestion();

  const editor = useComposerEditor({
    initialHtml: draft.bodyHtml,
    placeholder: "Write your message…",
    ariaLabel: "Message body",
    mergeTagSuggestion,
    onChange: (body) => patchDraft(session.id, body),
    onSubmitShortcut: () => handleSend(),
  });

  useAutosaveDraft({
    sessionId: session.id,
    workspaceSlug,
    draft,
    isEnabled: session.sendState === "idle",
  });

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), SAVED_LABEL_TICK_MS);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (draft.fromAccountId || accounts.length === 0) {
      return;
    }

    const firstGranted = accounts.find((account) => account.isGranted);

    if (firstGranted) {
      patchDraft(session.id, {
        fromAccountId: firstGranted.id,
        signatureId: firstGranted.defaultSignatureId,
      });
    }
  }, [accounts, draft.fromAccountId, patchDraft, session.id]);

  const report = useMemo(
    () =>
      runDeliverabilityChecks({
        draft,
        account: selectedAccount,
        suppressedEmails,
      }),
    [draft, selectedAccount, suppressedEmails],
  );

  const blockerSummary =
    report.blockers.length > 0 ? report.blockers[0].detail : null;

  const handleAddRecipients = (
    field: EmailRecipientField,
    recipients: readonly EmailRecipient[],
  ): void => {
    addRecipients(session.id, field, recipients);
    setRecipientQuery("");
  };

  const handleApplyTemplate = (template: EmailTemplateSummary): void => {
    if (!editor) {
      return;
    }

    replaceWithSanitisedHtml(editor, template.bodyHtml);
    patchDraft(session.id, {
      templateId: template.id,
      templateName: template.name,
      subject:
        draft.subject.trim().length > 0 ? draft.subject : template.subject,
    });
  };

  const handleDetachTemplate = (): void => {
    patchDraft(session.id, { templateId: null, templateName: null });
    toast("Template detached — the body stays as it is.");
  };

  const handleAttachFiles = (files: FileList): void => {
    for (const file of Array.from(files)) {
      addAttachment(session.id, {
        id: createId("att"),
        name: file.name,
        sizeBytes: file.size,
        contentType: file.type || "application/octet-stream",
      });
    }
  };

  const handleSchedule = (at: Date | null): void => {
    patchDraft(session.id, { scheduledAt: at ? at.toISOString() : null });
  };

  const handleSend = (): void => {
    if (!report.canSend) {
      toast.error(
        report.blockers[0]?.detail ?? "This message cannot send yet.",
      );
      return;
    }

    onSend(session, selectedAccount?.address ?? "your mailbox");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>): void => {
    if (event.key === "Escape" && !mergeTagSuggestion.state.isOpen) {
      event.stopPropagation();
      setWindowState(session.id, "minimised");
    }
  };

  const isMaximised = session.windowState === "maximised";

  return (
    <TooltipProvider>
      <section
        role="dialog"
        aria-modal={isMaximised}
        aria-label={draft.subject.trim() || "New message"}
        onKeyDown={handleKeyDown}
        className={cn(
          "pointer-events-auto flex animate-fa-pop flex-col overflow-hidden rounded-5xl border border-border-6 bg-card",
          isMaximised
            ? "fixed inset-4 z-50 md:inset-6"
            : "h-[min(38rem,calc(100dvh-6rem))] w-[min(52.5rem,calc(100vw-2rem))]",
        )}
      >
        <ComposerHeader
          title={draft.subject.trim() || "New message"}
          windowState={session.windowState}
          saveState={session.saveState}
          savedAt={session.savedAt}
          now={now}
          onMinimise={() => setWindowState(session.id, "minimised")}
          onToggleMaximise={() =>
            setWindowState(session.id, isMaximised ? "normal" : "maximised")
          }
          onClose={() => closeComposer(session.id)}
        />

        <ComposerFromRow
          accounts={accounts}
          selectedAccount={selectedAccount}
          isLoading={accountsQuery.isPending}
          isError={accountsQuery.isError}
          onRetry={() => void accountsQuery.refetch()}
          onSelect={(accountId) => {
            const account = accounts.find((item) => item.id === accountId);

            patchDraft(session.id, {
              fromAccountId: accountId,
              signatureId: account?.defaultSignatureId ?? draft.signatureId,
            });
          }}
        />

        <RecipientField
          label="To"
          recipients={draft.to}
          suggestions={suggestionsQuery.data ?? []}
          isLoadingSuggestions={suggestionsQuery.isFetching}
          suppressedEmails={suppressedEmails}
          autoFocus
          onQueryChange={setRecipientQuery}
          onAdd={(recipients) => handleAddRecipients("to", recipients)}
          onRemove={(recipientId) =>
            removeRecipient(session.id, "to", recipientId)
          }
          trailing={
            session.isCcVisible && session.isBccVisible ? null : (
              <div className="flex items-center gap-1">
                {session.isCcVisible ? null : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => setFieldVisible(session.id, "cc", true)}
                  >
                    Cc
                  </Button>
                )}
                {session.isBccVisible ? null : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => setFieldVisible(session.id, "bcc", true)}
                  >
                    Bcc
                  </Button>
                )}
              </div>
            )
          }
        />

        {session.isCcVisible ? (
          <RecipientField
            label="Cc"
            recipients={draft.cc}
            suggestions={suggestionsQuery.data ?? []}
            isLoadingSuggestions={suggestionsQuery.isFetching}
            suppressedEmails={suppressedEmails}
            onQueryChange={setRecipientQuery}
            onAdd={(recipients) => handleAddRecipients("cc", recipients)}
            onRemove={(recipientId) =>
              removeRecipient(session.id, "cc", recipientId)
            }
          />
        ) : null}

        {session.isBccVisible ? (
          <RecipientField
            label="Bcc"
            recipients={draft.bcc}
            suggestions={suggestionsQuery.data ?? []}
            isLoadingSuggestions={suggestionsQuery.isFetching}
            suppressedEmails={suppressedEmails}
            onQueryChange={setRecipientQuery}
            onAdd={(recipients) => handleAddRecipients("bcc", recipients)}
            onRemove={(recipientId) =>
              removeRecipient(session.id, "bcc", recipientId)
            }
          />
        ) : null}

        <ComposerSubjectRow
          value={draft.subject}
          onChange={(subject) => patchDraft(session.id, { subject })}
        />

        <div className="min-h-0 flex-1 overflow-y-auto px-panel py-3.5">
          {draft.templateName ? (
            <div className="mb-3.5 flex items-center gap-2 rounded-xl border border-accent-150 bg-accent-050 px-2.75 py-1.75">
              <FileText
                aria-hidden
                className="size-3.25 flex-none text-accent-700"
                strokeWidth={1.9}
              />
              <span className="min-w-0 flex-1 truncate text-sm font-bold text-accent-700">
                {draft.templateName}
              </span>
              <Button
                type="button"
                variant="link"
                size="xs"
                onClick={handleDetachTemplate}
              >
                Detach
                <X aria-hidden className="size-2.5" />
              </Button>
            </div>
          ) : null}

          {editor ? (
            <EditorContent editor={editor} />
          ) : (
            <div
              role="status"
              aria-label="Loading the editor"
              className="h-40 animate-pulse rounded-xl bg-surface-5"
            />
          )}

          <ComposerSignatureBlock
            signatures={signatures}
            activeSignature={activeSignature}
            onSelect={(signatureId) => patchDraft(session.id, { signatureId })}
          />
        </div>

        <ComposerAttachments
          attachments={draft.attachments}
          onRemove={(attachmentId) =>
            removeAttachment(session.id, attachmentId)
          }
        />

        {session.isToolbarVisible && editor ? (
          <ComposerToolbar editor={editor} />
        ) : null}

        <ComposerActions
          sendState={session.sendState}
          canSend={report.canSend}
          blockerSummary={blockerSummary}
          scheduledAt={draft.scheduledAt}
          timeZone={timeZone}
          isToolbarVisible={session.isToolbarVisible}
          trackOpens={draft.trackOpens}
          templates={templates}
          isTemplatesLoading={templatesQuery.isPending}
          onSend={handleSend}
          onSchedule={handleSchedule}
          onToggleToolbar={() => toggleToolbar(session.id)}
          onToggleTrackOpens={() =>
            patchDraft(session.id, { trackOpens: !draft.trackOpens })
          }
          onAttachFiles={handleAttachFiles}
          onInsertLink={(href) => editor && applyLink(editor, href)}
          onInsertImage={(src, alt) =>
            editor && insertImageByUrl(editor, src, alt)
          }
          onApplyTemplate={handleApplyTemplate}
          onDiscard={() => onDiscard(session)}
        />
      </section>

      <MergeTagSuggestionList suggestion={mergeTagSuggestion} />
    </TooltipProvider>
  );
};

export default ComposerWindow;
