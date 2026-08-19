export type EmailProviderId =
  | "gmail"
  | "outlook"
  | "m365"
  | "yahoo"
  | "private"
  | "proton"
  | "zoho"
  | "icloud"
  | "fastmail"
  | "imap";

export type ProviderAuthMethod =
  | "oauth"
  | "app-password"
  | "bridge-password"
  | "manual";

export type ProviderTone =
  | "accent"
  | "danger"
  | "success"
  | "warning"
  | "violet"
  | "neutral";

export interface EmailProvider {
  readonly id: EmailProviderId;
  readonly name: string;
  readonly sub: string;
  readonly authMethod: ProviderAuthMethod;
  readonly authLabel: string;
  readonly monogram: string;
  readonly tone: ProviderTone;
  readonly via: string;
  readonly consentHost: string | null;
  readonly domains: readonly string[];
  readonly imapHost: string;
  readonly imapPort: number;
  readonly smtpHost: string;
  readonly smtpPort: number;
}

export type DetectionConfidence = "high" | "low" | "manual";

export interface ProviderDetection {
  readonly provider: EmailProvider;
  readonly how: string;
  readonly confidence: DetectionConfidence;
}

export type MailboxScopeId = "send" | "reply" | "full";

export type ScopeTone = "warn" | "ok" | "caution";

export interface MailboxScopeLevel {
  readonly id: MailboxScopeId;
  readonly name: string;
  readonly tier: string;
  readonly tone: ScopeTone;
  readonly gain: string;
  readonly cost: string;
  readonly googleScopes: string;
  readonly microsoftScopes: string;
}

export interface ConnectVerificationStep {
  readonly label: string;
  readonly note: string;
}

export type Weekday = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

export interface MailboxSendingWindow {
  readonly days: readonly Weekday[];
  readonly startTime: string;
  readonly endTime: string;
  readonly timeZone: string;
}

export interface WorkspaceMember {
  readonly membershipId: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly organisationId: string;
}

export interface MailboxGrant {
  readonly membershipId: string;
  readonly name: string;
  readonly email: string;
  readonly role: string;
  readonly canSend: boolean;
}

export interface Mailbox {
  readonly id: string;
  readonly address: string;
  readonly displayName: string;
  readonly providerId: EmailProviderId;
  readonly providerLabel: string;
  readonly monogram: string;
  readonly authMethod: ProviderAuthMethod;
  readonly isSyncing: boolean;
  readonly lastSyncedAt: string;
  readonly imapEndpoint: string;
  readonly smtpEndpoint: string;
  readonly storageUsedGb: number;
  readonly storageQuotaGb: number;
  readonly scopeId: MailboxScopeId | null;
  readonly dailyCap: number;
  readonly sentToday: number;
  readonly sendingWindow: MailboxSendingWindow;
  readonly grants: readonly MailboxGrant[];
  readonly updatedAt: string;
}

export interface UpdateMailboxInput {
  readonly mailboxId: string;
  readonly displayName: string;
  readonly dailyCap: number;
  readonly sendingWindow: MailboxSendingWindow;
  readonly scopeId: MailboxScopeId | null;
  readonly grants: readonly MailboxGrant[];
  readonly appPassword: string | null;
  readonly expectedUpdatedAt: string;
}

export class MailboxConflictError extends Error {
  readonly latest: Mailbox;

  constructor(latest: Mailbox) {
    super(`${latest.address} was changed by someone else`);
    this.name = "MailboxConflictError";
    this.latest = latest;
  }
}

export interface ConnectMailboxInput {
  readonly providerId: EmailProviderId;
  readonly label: string;
  readonly address: string;
  readonly appPassword: string | null;
  readonly scopeId: MailboxScopeId | null;
}

export interface ConnectMailboxOutcome {
  readonly status: "consent-required" | "verifying";
  readonly providerId: EmailProviderId;
  readonly consentUrl: string | null;
  readonly verification: readonly ConnectVerificationStep[];
}

export interface DeleteMailboxOutcome {
  readonly mailboxId: string;
  readonly disconnectedAt: string;
  readonly recoverableUntil: string;
}
