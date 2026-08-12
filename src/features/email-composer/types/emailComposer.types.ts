export type EmailRecipientField = "to" | "cc" | "bcc";

export interface EmailRecipient {
  readonly id: string;
  readonly email: string;
  readonly name: string | null;
  readonly contactId: string | null;
}

export interface ContactSuggestion {
  readonly contactId: string;
  readonly email: string;
  readonly name: string | null;
  readonly company: string | null;
  readonly isSuppressed: boolean;
}

export type SendingAccountProvider = "gmail" | "outlook" | "imap";

export type SendingAccountHealth = "healthy" | "warming" | "paused";

export interface SendingAccount {
  readonly id: string;
  readonly address: string;
  readonly displayName: string;
  readonly provider: SendingAccountProvider;
  readonly kind: string;
  readonly health: SendingAccountHealth;
  readonly sentToday: number;
  readonly dailyCap: number;
  readonly isGranted: boolean;
  readonly defaultSignatureId: string | null;
}

export interface EmailSignature {
  readonly id: string;
  readonly label: string;
  readonly scope: "personal" | "workspace" | "organisation";
  readonly html: string;
  readonly isLockedByAdmin: boolean;
}

export interface EmailTemplateSummary {
  readonly id: string;
  readonly name: string;
  readonly scope: "private" | "workspace" | "global";
  readonly state: "draft" | "awaiting-approval" | "approved";
  readonly bodyHtml: string;
  readonly subject: string;
}

export interface DraftAttachment {
  readonly id: string;
  readonly name: string;
  readonly sizeBytes: number;
  readonly contentType: string;
}

export interface MergeTag {
  readonly id: string;
  readonly token: string;
  readonly label: string;
  readonly note: string;
}

export interface EmailDraft {
  readonly id: string;
  readonly fromAccountId: string | null;
  readonly to: readonly EmailRecipient[];
  readonly cc: readonly EmailRecipient[];
  readonly bcc: readonly EmailRecipient[];
  readonly subject: string;
  readonly bodyHtml: string;
  readonly bodyText: string;
  readonly attachments: readonly DraftAttachment[];
  readonly signatureId: string | null;
  readonly templateId: string | null;
  readonly templateName: string | null;
  readonly trackOpens: boolean;
  readonly scheduledAt: string | null;
  readonly updatedAt: string;
}

export type ComposerWindowState = "normal" | "minimised" | "maximised";

export type DraftSaveState = "idle" | "saving" | "saved" | "error";

export type ComposerSendState = "idle" | "sending" | "sent" | "failed";

export interface ComposerSession {
  readonly id: string;
  readonly draft: EmailDraft;
  readonly windowState: ComposerWindowState;
  readonly isCcVisible: boolean;
  readonly isBccVisible: boolean;
  readonly isToolbarVisible: boolean;
  readonly saveState: DraftSaveState;
  readonly savedAt: string | null;
  readonly sendState: ComposerSendState;
  readonly sendError: string | null;
}

export type DeliverabilityCheckId =
  | "recipients"
  | "sending-account"
  | "suppression"
  | "subject"
  | "body"
  | "plain-text-part"
  | "link-count"
  | "image-only"
  | "spam-triggers"
  | "sending-cap";

export type DeliverabilitySeverity = "pass" | "warning" | "blocker";

export interface DeliverabilityCheck {
  readonly id: DeliverabilityCheckId;
  readonly severity: DeliverabilitySeverity;
  readonly label: string;
  readonly detail: string;
}

export interface DeliverabilityReport {
  readonly checks: readonly DeliverabilityCheck[];
  readonly passedCount: number;
  readonly warnings: readonly DeliverabilityCheck[];
  readonly blockers: readonly DeliverabilityCheck[];
  readonly canSend: boolean;
}

export type SendFailureCode =
  | "not-configured"
  | "blocked-by-checks"
  | "account-not-granted"
  | "network";

export type SendOutcome =
  | {
      readonly status: "sent";
      readonly messageId: string;
      readonly sentAt: string;
    }
  | {
      readonly status: "scheduled";
      readonly messageId: string;
      readonly scheduledAt: string;
    }
  | { readonly status: "failed"; readonly code: SendFailureCode };

export interface SaveDraftOutcome {
  readonly draftId: string;
  readonly savedAt: string;
}

export interface ComposerOpenOptions {
  readonly to?: readonly EmailRecipient[];
  readonly cc?: readonly EmailRecipient[];
  readonly bcc?: readonly EmailRecipient[];
  readonly subject?: string;
  readonly bodyHtml?: string;
  readonly fromAccountId?: string;
  readonly draftId?: string;
}
