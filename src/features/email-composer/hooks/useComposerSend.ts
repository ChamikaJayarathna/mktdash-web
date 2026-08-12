"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useDiscardDraft } from "../api/useSaveDraft";
import { useCancelSend, useSendEmail } from "../api/useSendEmail";
import { useEmailComposerStore } from "../store/emailComposer.store";
import type { ComposerSession, EmailDraft } from "../types/emailComposer.types";

export interface ComposerSendActions {
  readonly send: (session: ComposerSession, fromAddress: string) => void;
  readonly discard: (session: ComposerSession) => void;
}

const reopenOptions = (draft: EmailDraft) => ({
  draftId: draft.id,
  to: draft.to,
  cc: draft.cc,
  bcc: draft.bcc,
  subject: draft.subject,
  bodyHtml: draft.bodyHtml,
  fromAccountId: draft.fromAccountId ?? undefined,
});

export const useComposerSend = (
  workspaceSlug: string,
  senderName: string,
): ComposerSendActions => {
  const closeComposer = useEmailComposerStore((state) => state.closeComposer);
  const openComposer = useEmailComposerStore((state) => state.openComposer);
  const setSendState = useEmailComposerStore((state) => state.setSendState);

  const sendEmail = useSendEmail(workspaceSlug);
  const cancelSend = useCancelSend(workspaceSlug);
  const discardDraft = useDiscardDraft(workspaceSlug);

  const send = useCallback(
    (session: ComposerSession, fromAddress: string) => {
      const { draft } = session;
      setSendState(session.id, "sending");

      sendEmail.mutate(draft, {
        onSuccess: (outcome) => {
          if (outcome.status === "failed") {
            setSendState(session.id, "failed", outcome.code);
            toast.error(
              "Nothing was sent — the email service rejected this message.",
            );
            return;
          }

          setSendState(session.id, "sent");
          closeComposer(session.id);

          const message =
            outcome.status === "scheduled"
              ? `Queued to send from ${fromAddress}.`
              : `Sent from ${fromAddress}, attributed to ${senderName}.`;

          toast.success(message, {
            action: {
              label: "Undo",
              onClick: () =>
                cancelSend.mutate(outcome.messageId, {
                  onSuccess: (wasCancelled) => {
                    if (!wasCancelled) {
                      toast.error(
                        "Too late — this had already left the mailbox.",
                      );
                      return;
                    }

                    openComposer(reopenOptions(draft));
                    toast("Stopped before it left — back in the composer.");
                  },
                }),
            },
          });
        },
        onError: () => {
          setSendState(session.id, "failed", "network");
          toast.error(
            "Nothing was sent — the request never reached the service.",
          );
        },
      });
    },
    [
      cancelSend,
      closeComposer,
      openComposer,
      sendEmail,
      senderName,
      setSendState,
    ],
  );

  const discard = useCallback(
    (session: ComposerSession) => {
      const { draft } = session;
      closeComposer(session.id);
      discardDraft.mutate(draft.id);

      toast("Draft discarded — recoverable from Trash for 30 days.", {
        action: {
          label: "Undo",
          onClick: () => openComposer(reopenOptions(draft)),
        },
      });
    },
    [closeComposer, discardDraft, openComposer],
  );

  return { send, discard };
};
