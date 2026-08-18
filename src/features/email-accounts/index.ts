export { default as EmailAccountsBoard } from "./components/EmailAccountsBoard";
export type { EmailAccountsBoardProps } from "./components/EmailAccountsBoard";
export { default as AddAccountPanel } from "./components/AddAccountPanel";
export type { AddAccountPanelProps } from "./components/AddAccountPanel";
export { default as MailboxList } from "./components/MailboxList";
export type { MailboxListProps } from "./components/MailboxList";
export { default as MailboxCard } from "./components/MailboxCard";
export type { MailboxCardProps } from "./components/MailboxCard";
export { default as MailboxCardSkeleton } from "./components/MailboxCardSkeleton";
export { default as EmailAccountsEmptyState } from "./components/EmailAccountsEmptyState";
export { default as EmailAccountsErrorState } from "./components/EmailAccountsErrorState";
export type { EmailAccountsErrorStateProps } from "./components/EmailAccountsErrorState";

export { useEmailProviders } from "./hooks/useEmailProviders";
export { useMailboxes } from "./hooks/useMailboxes";
export { useConnectMailbox } from "./hooks/useConnectMailbox";
export { useToggleMailboxSync } from "./hooks/useToggleMailboxSync";
export type { ToggleMailboxSyncVariables } from "./hooks/useToggleMailboxSync";
export { useDeleteMailbox } from "./hooks/useDeleteMailbox";
export type { DeleteMailboxVariables } from "./hooks/useDeleteMailbox";
export { useRelativeTime } from "./hooks/useRelativeTime";

export { emailAccountsKeys } from "./api/emailAccountsKeys";
export { RECOVERY_WINDOW_DAYS } from "./api/emailAccountsService";

export {
  STORAGE_PRESSURE_PERCENT,
  formatEndpoint,
  formatStorageText,
  isStorageUnderPressure,
  providerToneClasses,
  storageUsagePercent,
  syncStateLabel,
} from "./lib/emailAccountFormat";
export { formatSyncAgo } from "./lib/relativeTime";

export {
  connectMailboxSchema,
  passwordRequiredSchema,
  type ConnectMailboxValues,
} from "./schemas/connectMailbox.schema";
export {
  buildDeleteMailboxSchema,
  type DeleteMailboxValues,
} from "./schemas/deleteMailbox.schema";

export type {
  ConnectMailboxInput,
  ConnectMailboxOutcome,
  DeleteMailboxOutcome,
  EmailProvider,
  EmailProviderId,
  Mailbox,
  ProviderAuthMethod,
  ProviderTone,
} from "./types/emailAccount.types";
