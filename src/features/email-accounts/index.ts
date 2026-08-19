export { default as EmailAccountsBoard } from "./components/EmailAccountsBoard";
export type { EmailAccountsBoardProps } from "./components/EmailAccountsBoard";
export { default as ConnectMailboxLauncher } from "./components/ConnectMailboxLauncher";
export type { ConnectMailboxLauncherProps } from "./components/ConnectMailboxLauncher";
export { default as ConnectMailboxDialog } from "./components/ConnectMailboxDialog";
export type { ConnectMailboxDialogProps } from "./components/ConnectMailboxDialog";
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
export { useConnectMailboxWizard } from "./hooks/useConnectMailboxWizard";
export type { ConnectWizardStep } from "./hooks/useConnectMailboxWizard";

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
export { detectProvider, emailDomain } from "./lib/detectProvider";
export {
  MAILBOX_SCOPE_LEVELS,
  RECOMMENDED_SCOPE_ID,
  buildVerificationSteps,
  scopeStringFor,
} from "./lib/scopeLevels";

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
  ProviderDetection,
  ProviderTone,
  ConnectVerificationStep,
  DetectionConfidence,
  MailboxScopeId,
  MailboxScopeLevel,
  ScopeTone,
} from "./types/emailAccount.types";
