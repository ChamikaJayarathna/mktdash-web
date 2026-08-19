import type {
  ConnectVerificationStep,
  EmailProvider,
  MailboxScopeId,
  MailboxScopeLevel,
} from "../types/emailAccount.types";

export const RECOMMENDED_SCOPE_ID: MailboxScopeId = "reply";

export const MAILBOX_SCOPE_LEVELS: readonly MailboxScopeLevel[] = [
  {
    id: "send",
    name: "Send only",
    tier: "Sensitive scope",
    tone: "warn",
    gain: "Compose, sequences, templates and signatures all work.",
    cost: "No reply detection. Follow-ups cannot stop themselves when someone answers — you would be chasing people who already replied.",
    googleScopes: "gmail.send",
    microsoftScopes: "Mail.Send",
  },
  {
    id: "reply",
    name: "Send and read replies",
    tier: "Restricted · CASA Tier 2 audit",
    tone: "ok",
    gain: "Everything above, plus the shared inbox, reply-intent classification and automatic follow-up stop.",
    cost: "Cannot file mail into folders or push drafts back to the provider.",
    googleScopes: "gmail.send + gmail.readonly",
    microsoftScopes: "Mail.Send + Mail.Read",
  },
  {
    id: "full",
    name: "Full mailbox",
    tier: "Restricted · CASA Tier 2 audit",
    tone: "caution",
    gain: "Folders sync both ways, drafts appear in the real mailbox, labels write back.",
    cost: "The broadest grant we can request. Only worth it if two-way folder sync matters to this team.",
    googleScopes: "mail.google.com",
    microsoftScopes: "Mail.ReadWrite + Mail.Send",
  },
];

const MICROSOFT_PROVIDER_IDS = new Set(["outlook", "m365"]);

export const scopeStringFor = (
  level: MailboxScopeLevel,
  provider: EmailProvider,
): string =>
  MICROSOFT_PROVIDER_IDS.has(provider.id)
    ? level.microsoftScopes
    : level.googleScopes;

export const buildVerificationSteps = (
  address: string,
): readonly ConnectVerificationStep[] => {
  const domain = address.split("@")[1] ?? "the sending domain";

  return [
    {
      label: "Authorisation exchanged",
      note: "Refresh token encrypted per tenant, never logged",
    },
    { label: "Mailbox reachable", note: "Read one message header" },
    {
      label: "Send permission confirmed",
      note: "Draft created, then discarded",
    },
    {
      label: "SPF, DKIM and DMARC",
      note: `All three pass for ${domain}`,
    },
    {
      label: "Warmup started",
      note: "Day 1 cap 20 sends, ramping to 120 over 18 days",
    },
  ];
};
