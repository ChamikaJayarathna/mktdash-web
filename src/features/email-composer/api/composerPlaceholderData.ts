import type {
  ContactSuggestion,
  EmailSignature,
  EmailTemplateSummary,
  SendingAccount,
} from "../types/emailComposer.types";

// TODO: Remove this module once the email service is wired through
export const PLACEHOLDER_SENDING_ACCOUNTS: readonly SendingAccount[] = [
  {
    id: "acc_priya",
    address: "priya@followaxis.com",
    displayName: "Priya Raman",
    provider: "gmail",
    kind: "Personal",
    health: "healthy",
    sentToday: 38,
    dailyCap: 120,
    isGranted: true,
    defaultSignatureId: "sig_priya_default",
  },
  {
    id: "acc_hello",
    address: "hello@followaxis.com",
    displayName: "Follow Axis Team",
    provider: "outlook",
    kind: "Shared · 4 members",
    health: "healthy",
    sentToday: 64,
    dailyCap: 80,
    isGranted: true,
    defaultSignatureId: "sig_brand",
  },
  {
    id: "acc_northwind",
    address: "northwind@client.co",
    displayName: "Northwind Outreach",
    provider: "outlook",
    kind: "Client mailbox",
    health: "warming",
    sentToday: 22,
    dailyCap: 30,
    isGranted: true,
    defaultSignatureId: null,
  },
  {
    id: "acc_exec",
    address: "ceo@followaxis.com",
    displayName: "Executive",
    provider: "gmail",
    kind: "Restricted",
    health: "paused",
    sentToday: 0,
    dailyCap: 40,
    isGranted: false,
    defaultSignatureId: null,
  },
];

export const PLACEHOLDER_SUPPRESSED_EMAILS: readonly string[] = [
  "dana@northwind.co",
];

export const PLACEHOLDER_CONTACTS: readonly ContactSuggestion[] = [
  {
    contactId: "con_marcus",
    email: "m.lee@northwind.co",
    name: "Marcus Lee",
    company: "Northwind",
    isSuppressed: false,
  },
  {
    contactId: "con_dana",
    email: "dana@northwind.co",
    name: "Dana Whitfield",
    company: "Northwind",
    isSuppressed: true,
  },
  {
    contactId: "con_sofia",
    email: "sofia@halcyon.studio",
    name: "Sofia Ramos",
    company: "Halcyon Studio",
    isSuppressed: false,
  },
  {
    contactId: "con_tobias",
    email: "t.green@vertexlabs.io",
    name: "Tobias Green",
    company: "Vertex Labs",
    isSuppressed: false,
  },
  {
    contactId: "con_aisha",
    email: "aisha@brightpath.org",
    name: "Aisha Nkemelu",
    company: "Bright Path",
    isSuppressed: false,
  },
];

export const PLACEHOLDER_SIGNATURES: readonly EmailSignature[] = [
  {
    id: "sig_priya_default",
    label: "Priya — default",
    scope: "personal",
    html: '<p><strong>Priya Raman</strong><br>Partnerships · Follow Axis<br><a href="https://followaxis.com">followaxis.com</a> · +44 20 7946 0112</p>',
    isLockedByAdmin: false,
  },
  {
    id: "sig_priya_short",
    label: "Priya — short",
    scope: "personal",
    html: "<p><strong>Priya Raman</strong> · Follow Axis</p>",
    isLockedByAdmin: false,
  },
  {
    id: "sig_brand",
    label: "Follow Axis — brand standard",
    scope: "organisation",
    html: '<p><strong>Priya Raman</strong><br>Partnerships · Follow Axis<br><a href="https://followaxis.com">followaxis.com</a></p>',
    isLockedByAdmin: true,
  },
];

export const PLACEHOLDER_TEMPLATES: readonly EmailTemplateSummary[] = [
  {
    id: "tpl_intro",
    name: "Partnership intro",
    scope: "workspace",
    state: "approved",
    subject: "A quick idea for {company}",
    bodyHtml:
      "<p>Hi {first_name},</p><p>We help teams run outbound from the mailboxes they already own, with follow-up that stops the moment someone replies.</p><p>Worth fifteen minutes this week?</p>",
  },
  {
    id: "tpl_nudge",
    name: "Nudge — short",
    scope: "private",
    state: "draft",
    subject: "Still worth a look?",
    bodyHtml:
      "<p>Hi {first_name},</p><p>Bumping this in case it slipped — still worth a look?</p>",
  },
  {
    id: "tpl_referral",
    name: "Referral ask",
    scope: "global",
    state: "approved",
    subject: "Wrong person?",
    bodyHtml:
      "<p>Hi {first_name},</p><p>If this is not your area any more, who should I be speaking to instead?</p>",
  },
];
