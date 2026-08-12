import type {
  DeliverabilityCheck,
  DeliverabilityReport,
  EmailDraft,
  SendingAccount,
} from "../types/emailComposer.types";
import { countImages, countLinks, htmlToPlainText } from "./htmlToPlainText";

export const MAX_LINKS_BEFORE_WARNING = 8;

const IMAGE_ONLY_TEXT_FLOOR = 60;

const SPAM_TRIGGER_PATTERNS: readonly { label: string; pattern: RegExp }[] = [
  { label: "act now", pattern: /\bact now\b/i },
  { label: "click here", pattern: /\bclick here\b/i },
  { label: "risk free", pattern: /\brisk[- ]free\b/i },
  { label: "100% free", pattern: /\b100%\s*free\b/i },
  { label: "guaranteed", pattern: /\bguarantee(d)?\b/i },
  { label: "limited time", pattern: /\blimited time\b/i },
  { label: "no obligation", pattern: /\bno obligation\b/i },
  { label: "cash bonus", pattern: /\bcash bonus\b/i },
  { label: "shouting caps", pattern: /\b[A-Z]{5,}\b/ },
  { label: "repeated punctuation", pattern: /[!?]{2,}/ },
];

export const findSpamTriggers = (
  subject: string,
  bodyText: string,
): readonly string[] => {
  const haystack = `${subject}\n${bodyText}`;

  return SPAM_TRIGGER_PATTERNS.filter(({ pattern }) =>
    pattern.test(haystack),
  ).map(({ label }) => label);
};

const formatList = (values: readonly string[]): string =>
  values.length <= 1
    ? (values[0] ?? "")
    : `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;

export interface DeliverabilityInput {
  readonly draft: EmailDraft;
  readonly account: SendingAccount | null;
  readonly suppressedEmails: readonly string[];
}

export const runDeliverabilityChecks = ({
  draft,
  account,
  suppressedEmails,
}: DeliverabilityInput): DeliverabilityReport => {
  const allRecipients = [...draft.to, ...draft.cc, ...draft.bcc];
  const bodyText = draft.bodyText || htmlToPlainText(draft.bodyHtml);
  const linkCount = countLinks(draft.bodyHtml);
  const imageCount = countImages(draft.bodyHtml);
  const suppressed = new Set(
    suppressedEmails.map((email) => email.toLowerCase()),
  );
  const suppressedHits = allRecipients.filter((recipient) =>
    suppressed.has(recipient.email),
  );
  const spamTriggers = findSpamTriggers(draft.subject, bodyText);
  const remainingCap = account ? account.dailyCap - account.sentToday : 0;

  const checks: DeliverabilityCheck[] = [
    draft.to.length > 0
      ? {
          id: "recipients",
          severity: "pass",
          label: "Has a recipient",
          detail: `${allRecipients.length} recipient${allRecipients.length === 1 ? "" : "s"} on this message`,
        }
      : {
          id: "recipients",
          severity: "blocker",
          label: "Has a recipient",
          detail: "Add at least one address in To before this can send",
        },

    account && account.isGranted
      ? {
          id: "sending-account",
          severity: "pass",
          label: "Sends from a granted mailbox",
          detail: `Leaves from ${account.address}`,
        }
      : {
          id: "sending-account",
          severity: "blocker",
          label: "Sends from a granted mailbox",
          detail: account
            ? `You are not granted ${account.address} — pick a mailbox you can send from`
            : "Choose the mailbox this leaves from",
        },

    suppressedHits.length === 0
      ? {
          id: "suppression",
          severity: "pass",
          label: "No suppressed addresses",
          detail: "Nobody here has unsubscribed or hard-bounced",
        }
      : {
          id: "suppression",
          severity: "blocker",
          label: "No suppressed addresses",
          detail: `${formatList(suppressedHits.map((recipient) => recipient.email))} ${suppressedHits.length === 1 ? "is" : "are"} suppressed org-wide — remove ${suppressedHits.length === 1 ? "it" : "them"} to send`,
        },

    draft.subject.trim().length > 0
      ? {
          id: "subject",
          severity: "pass",
          label: "Has a subject line",
          detail: `${draft.subject.trim().length} characters`,
        }
      : {
          id: "subject",
          severity: "warning",
          label: "Has a subject line",
          detail: "A blank subject is filtered more often and reads as spam",
        },

    bodyText.length > 0 || imageCount > 0
      ? {
          id: "body",
          severity: "pass",
          label: "Has a message body",
          detail: `${bodyText.length} characters`,
        }
      : {
          id: "body",
          severity: "blocker",
          label: "Has a message body",
          detail: "There is nothing to send yet",
        },

    bodyText.length > 0
      ? {
          id: "plain-text-part",
          severity: "pass",
          label: "Plain-text part generated",
          detail: "Clients that refuse HTML still get a readable message",
        }
      : {
          id: "plain-text-part",
          severity: "warning",
          label: "Plain-text part generated",
          detail:
            "No plain-text part — HTML-only mail is a documented spam signal",
        },

    linkCount <= MAX_LINKS_BEFORE_WARNING
      ? {
          id: "link-count",
          severity: "pass",
          label: "Link count is sane",
          detail: `${linkCount} link${linkCount === 1 ? "" : "s"}`,
        }
      : {
          id: "link-count",
          severity: "warning",
          label: "Link count is sane",
          detail: `${linkCount} links — past ${MAX_LINKS_BEFORE_WARNING} this starts reading as bulk mail`,
        },

    imageCount === 0 || bodyText.length >= IMAGE_ONLY_TEXT_FLOOR
      ? {
          id: "image-only",
          severity: "pass",
          label: "Not image-only",
          detail:
            imageCount === 0
              ? "No images to block"
              : `${imageCount} image${imageCount === 1 ? "" : "s"} alongside real text`,
        }
      : {
          id: "image-only",
          severity: "warning",
          label: "Not image-only",
          detail:
            "Almost all image — recipients who block images would see an empty message",
        },

    spamTriggers.length === 0
      ? {
          id: "spam-triggers",
          severity: "pass",
          label: "No spam-trigger phrasing",
          detail: "Nothing that filters commonly score against",
        }
      : {
          id: "spam-triggers",
          severity: "warning",
          label: "No spam-trigger phrasing",
          detail: `${formatList(spamTriggers)} — filters score against this phrasing`,
        },

    !account || remainingCap > 0
      ? {
          id: "sending-cap",
          severity: "pass",
          label: "Within today's sending cap",
          detail: account
            ? `${account.sentToday} of ${account.dailyCap} sends today`
            : "No cap to check yet",
        }
      : {
          id: "sending-cap",
          severity: "blocker",
          label: "Within today's sending cap",
          detail: `${account.address} has used all ${account.dailyCap} of today's sends — schedule this for tomorrow instead`,
        },
  ];

  const warnings = checks.filter((check) => check.severity === "warning");
  const blockers = checks.filter((check) => check.severity === "blocker");

  return {
    checks,
    passedCount: checks.length - warnings.length - blockers.length,
    warnings,
    blockers,
    canSend: blockers.length === 0,
  };
};
