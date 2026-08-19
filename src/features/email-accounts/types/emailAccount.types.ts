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

export interface Mailbox {
  readonly id: string;
  readonly address: string;
  readonly displayName: string;
  readonly providerId: EmailProviderId;
  readonly providerLabel: string;
  readonly monogram: string;
  readonly isSyncing: boolean;
  readonly lastSyncedAt: string;
  readonly imapEndpoint: string;
  readonly smtpEndpoint: string;
  readonly storageUsedGb: number;
  readonly storageQuotaGb: number;
  readonly updatedAt: string;
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
