export { default as ComposerWindow } from "./components/ComposerWindow";
export type { ComposerWindowProps } from "./components/ComposerWindow";
export { default as ComposerMinimisedBar } from "./components/ComposerMinimisedBar";
export type { ComposerMinimisedBarProps } from "./components/ComposerMinimisedBar";

export { useComposerSend } from "./hooks/useComposerSend";
export type { ComposerSendActions } from "./hooks/useComposerSend";

export {
  MAX_OPEN_COMPOSERS,
  selectHasCapacity,
  selectSessions,
  useEmailComposerStore,
} from "./store/emailComposer.store";

export { runDeliverabilityChecks } from "./lib/deliverability";
export { htmlToPlainText } from "./lib/htmlToPlainText";
export {
  dedupeRecipients,
  isValidEmail,
  parseRecipientInput,
  recipientLabel,
} from "./lib/parseRecipients";
export {
  buildScheduleOptions,
  formatScheduleStamp,
  resolveBrowserTimeZone,
} from "./lib/scheduleOptions";
export { MERGE_TAGS } from "./lib/mergeTags";
export { sanitizeEmailHtml } from "./lib/sanitizeEmailHtml";

export {
  emailDraftSchema,
  sendableDraftSchema,
  type EmailDraftValues,
  type SendableDraftValues,
} from "./schemas/emailDraft.schema";

export type {
  ComposerOpenOptions,
  ComposerSendState,
  ComposerSession,
  ComposerWindowState,
  ContactSuggestion,
  DeliverabilityCheck,
  DeliverabilityReport,
  DraftAttachment,
  EmailDraft,
  EmailRecipient,
  EmailRecipientField,
  EmailSignature,
  EmailTemplateSummary,
  MergeTag,
  SendOutcome,
  SendingAccount,
} from "./types/emailComposer.types";
