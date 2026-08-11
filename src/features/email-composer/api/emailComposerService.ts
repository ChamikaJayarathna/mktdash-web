import type {
  ContactSuggestion,
  EmailDraft,
  EmailSignature,
  EmailTemplateSummary,
  SaveDraftOutcome,
  SendOutcome,
  SendingAccount,
} from "../types/emailComposer.types";
import {
  PLACEHOLDER_CONTACTS,
  PLACEHOLDER_SENDING_ACCOUNTS,
  PLACEHOLDER_SIGNATURES,
  PLACEHOLDER_SUPPRESSED_EMAILS,
  PLACEHOLDER_TEMPLATES,
} from "./composerPlaceholderData";

const NETWORK_DELAY_MS = 180;

const scoped = <TValue>(
  workspaceSlug: string,
  value: TValue,
): Promise<TValue> => {
  void workspaceSlug;

  return new Promise((resolve) => {
    setTimeout(() => resolve(value), NETWORK_DELAY_MS);
  });
};

export const fetchSendingAccounts = (
  workspaceSlug: string,
): Promise<readonly SendingAccount[]> =>
  scoped(workspaceSlug, PLACEHOLDER_SENDING_ACCOUNTS);

export const fetchSignatures = (
  workspaceSlug: string,
): Promise<readonly EmailSignature[]> =>
  scoped(workspaceSlug, PLACEHOLDER_SIGNATURES);

export const fetchTemplates = (
  workspaceSlug: string,
): Promise<readonly EmailTemplateSummary[]> =>
  scoped(workspaceSlug, PLACEHOLDER_TEMPLATES);

export const fetchSuppressedEmails = (
  workspaceSlug: string,
): Promise<readonly string[]> =>
  scoped(workspaceSlug, PLACEHOLDER_SUPPRESSED_EMAILS);

export const searchContacts = (
  workspaceSlug: string,
  query: string,
): Promise<readonly ContactSuggestion[]> => {
  const needle = query.trim().toLowerCase();

  if (needle.length === 0) {
    return scoped(workspaceSlug, []);
  }

  return scoped(
    workspaceSlug,
    PLACEHOLDER_CONTACTS.filter(
      (contact) =>
        contact.email.includes(needle) ||
        (contact.name?.toLowerCase().includes(needle) ?? false) ||
        (contact.company?.toLowerCase().includes(needle) ?? false),
    ),
  );
};

export const saveDraft = (
  workspaceSlug: string,
  draft: EmailDraft,
): Promise<SaveDraftOutcome> =>
  scoped(workspaceSlug, {
    draftId: draft.id,
    savedAt: new Date().toISOString(),
  });

export const discardDraft = (
  workspaceSlug: string,
  draftId: string,
): Promise<void> => {
  void draftId;

  return scoped(workspaceSlug, undefined);
};

export const sendEmail = (
  workspaceSlug: string,
  draft: EmailDraft,
): Promise<SendOutcome> => {
  if (!draft.fromAccountId) {
    return scoped(workspaceSlug, {
      status: "failed",
      code: "account-not-granted",
    });
  }

  if (draft.scheduledAt) {
    return scoped(workspaceSlug, {
      status: "scheduled",
      messageId: draft.id,
      scheduledAt: draft.scheduledAt,
    });
  }

  return scoped(workspaceSlug, {
    status: "sent",
    messageId: draft.id,
    sentAt: new Date().toISOString(),
  });
};

export const cancelSend = (
  workspaceSlug: string,
  messageId: string,
): Promise<boolean> => {
  void messageId;

  return scoped(workspaceSlug, true);
};
