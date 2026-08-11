import type {
  EmailDraft,
  EmailRecipient,
  SendingAccount,
} from "@/features/email-composer";

export const recipientFixture = (
  overrides: Partial<EmailRecipient> = {},
): EmailRecipient => ({
  id: "rcp_1",
  email: "marcus@northwind.co",
  name: "Marcus Lee",
  contactId: "con_marcus",
  ...overrides,
});

export const sendingAccountFixture = (
  overrides: Partial<SendingAccount> = {},
): SendingAccount => ({
  id: "acc_1",
  address: "hello@followaxis.com",
  displayName: "Follow Axis Team",
  provider: "outlook",
  kind: "Shared · 4 members",
  health: "healthy",
  sentToday: 10,
  dailyCap: 80,
  isGranted: true,
  defaultSignatureId: null,
  ...overrides,
});

export const emailDraftFixture = (
  overrides: Partial<EmailDraft> = {},
): EmailDraft => ({
  id: "draft_1",
  fromAccountId: "acc_1",
  to: [recipientFixture()],
  cc: [],
  bcc: [],
  subject: "Partnership intro",
  bodyHtml: "<p>Worth fifteen minutes this week?</p>",
  bodyText: "Worth fifteen minutes this week?",
  attachments: [],
  signatureId: null,
  templateId: null,
  templateName: null,
  trackOpens: false,
  scheduledAt: null,
  updatedAt: "2026-08-09T09:00:00.000Z",
  ...overrides,
});
