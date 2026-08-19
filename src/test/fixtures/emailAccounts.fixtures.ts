import type { EmailProvider, Mailbox } from "@/features/email-accounts";

export const gmailProviderFixture: EmailProvider = {
  id: "gmail",
  name: "Gmail",
  sub: "Google Workspace",
  authMethod: "oauth",
  authLabel: "OAuth 2.0",
  monogram: "G",
  tone: "danger",
  via: "Gmail API",
  consentHost: "accounts.google.com",
  domains: ["gmail.com", "googlemail.com"],
  imapHost: "imap.gmail.com",
  imapPort: 993,
  smtpHost: "smtp.gmail.com",
  smtpPort: 465,
};

export const fastmailProviderFixture: EmailProvider = {
  id: "fastmail",
  name: "Fastmail",
  sub: "Fastmail",
  authMethod: "app-password",
  authLabel: "App password",
  monogram: "F",
  tone: "success",
  via: "IMAP and SMTP",
  consentHost: null,
  domains: ["fastmail.com", "fastmail.fm"],
  imapHost: "imap.fastmail.com",
  imapPort: 993,
  smtpHost: "smtp.fastmail.com",
  smtpPort: 465,
};

export const syncingMailboxFixture: Mailbox = {
  id: "mbx_fixture",
  address: "priya@followaxis.com",
  displayName: "Priya Raman",
  providerId: "gmail",
  providerLabel: "Gmail",
  monogram: "PR",
  isSyncing: true,
  lastSyncedAt: "2026-08-12T09:59:26.000Z",
  imapEndpoint: "imap.gmail.com:993",
  smtpEndpoint: "smtp.gmail.com:465",
  storageUsedGb: 4.2,
  storageQuotaGb: 15,
  updatedAt: "2026-08-12T09:59:26.000Z",
};

export const pausedMailboxFixture: Mailbox = {
  ...syncingMailboxFixture,
  id: "mbx_fixture_paused",
  address: "northwind@client.co",
  displayName: "Northwind Outreach",
  providerId: "outlook",
  providerLabel: "Outlook",
  monogram: "NW",
  isSyncing: false,
  storageUsedGb: 6.1,
  storageQuotaGb: 15,
};

export const nearlyFullMailboxFixture: Mailbox = {
  ...syncingMailboxFixture,
  id: "mbx_fixture_full",
  storageUsedGb: 14.4,
  storageQuotaGb: 15,
};
