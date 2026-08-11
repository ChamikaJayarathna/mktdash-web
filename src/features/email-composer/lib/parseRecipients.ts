import { z } from "zod";
import type { EmailRecipient } from "../types/emailComposer.types";
import { createId } from "./createId";

const emailSchema = z.email();

const SEPARATORS = /[,;\n\t]+/;

const ANGLE_FORM = /^(.*?)<([^<>]+)>$/;

export interface ParsedRecipients {
  readonly recipients: readonly EmailRecipient[];
  readonly invalid: readonly string[];
}

export const isValidEmail = (value: string): boolean =>
  emailSchema.safeParse(value.trim()).success;

export const normaliseEmail = (value: string): string =>
  value.trim().toLowerCase();

const stripQuotes = (value: string): string =>
  value
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .trim();

const splitTokens = (input: string): string[] =>
  input
    .split(SEPARATORS)
    .flatMap((token) =>
      token.includes("<") ? [token] : token.split(/\s+/).filter(Boolean),
    )
    .map((token) => token.trim())
    .filter(Boolean);

const toRecipient = (token: string): EmailRecipient | null => {
  const angleMatch = ANGLE_FORM.exec(token);
  const name = angleMatch ? stripQuotes(angleMatch[1]) : "";
  const email = normaliseEmail(angleMatch ? angleMatch[2] : token);

  if (!isValidEmail(email)) {
    return null;
  }

  return {
    id: createId("rcp"),
    email,
    name: name.length > 0 ? name : null,
    contactId: null,
  };
};

export const parseRecipientInput = (input: string): ParsedRecipients => {
  const recipients: EmailRecipient[] = [];
  const invalid: string[] = [];

  for (const token of splitTokens(input)) {
    const recipient = toRecipient(token);

    if (recipient) {
      recipients.push(recipient);
    } else {
      invalid.push(token);
    }
  }

  return { recipients, invalid };
};

export const dedupeRecipients = (
  existing: readonly EmailRecipient[],
  incoming: readonly EmailRecipient[],
): readonly EmailRecipient[] => {
  const seen = new Set(existing.map((recipient) => recipient.email));
  const added: EmailRecipient[] = [];

  for (const recipient of incoming) {
    if (seen.has(recipient.email)) {
      continue;
    }

    seen.add(recipient.email);
    added.push(recipient);
  }

  return added.length > 0 ? [...existing, ...added] : existing;
};

export const recipientLabel = (recipient: EmailRecipient): string =>
  recipient.name ?? recipient.email;

export const recipientInitials = (recipient: EmailRecipient): string => {
  const source = recipient.name ?? recipient.email.split("@")[0];
  const parts = source.split(/[\s._-]+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  const initials =
    parts.length === 1
      ? parts[0].slice(0, 2)
      : `${parts[0][0]}${parts[parts.length - 1][0]}`;

  return initials.toUpperCase();
};
