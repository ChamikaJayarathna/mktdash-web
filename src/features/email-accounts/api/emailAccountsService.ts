import type {
  ConnectMailboxInput,
  ConnectMailboxOutcome,
  DeleteMailboxOutcome,
  EmailProvider,
  Mailbox,
} from "../types/emailAccount.types";
import { buildVerificationSteps } from "../lib/scopeLevels";
import {
  PLACEHOLDER_MAILBOXES,
  PLACEHOLDER_PROVIDERS,
} from "./emailAccountsPlaceholderData";

const NETWORK_DELAY_MS = 180;

export const RECOVERY_WINDOW_DAYS = 30;

const DAY_MS = 24 * 60 * 60 * 1000;

// TODO: Drop this in-memory store once the email service is wired through
let mailboxStore: readonly Mailbox[] = PLACEHOLDER_MAILBOXES;

export const resetMailboxStore = (): void => {
  mailboxStore = PLACEHOLDER_MAILBOXES;
};

const scoped = <TValue>(
  workspaceSlug: string,
  resolveValue: () => TValue,
): Promise<TValue> => {
  void workspaceSlug;

  return new Promise((resolve) => {
    setTimeout(() => resolve(resolveValue()), NETWORK_DELAY_MS);
  });
};

export const fetchEmailProviders = (
  workspaceSlug: string,
): Promise<readonly EmailProvider[]> =>
  scoped(workspaceSlug, () => PLACEHOLDER_PROVIDERS);

export const fetchMailboxes = (
  workspaceSlug: string,
): Promise<readonly Mailbox[]> => scoped(workspaceSlug, () => mailboxStore);

export const setMailboxSync = (
  workspaceSlug: string,
  mailboxId: string,
  isSyncing: boolean,
): Promise<Mailbox> =>
  scoped(workspaceSlug, () => {
    const syncedAt = new Date().toISOString();

    mailboxStore = mailboxStore.map((mailbox) =>
      mailbox.id === mailboxId
        ? { ...mailbox, isSyncing, updatedAt: syncedAt }
        : mailbox,
    );

    const updated = mailboxStore.find((mailbox) => mailbox.id === mailboxId);

    if (!updated) {
      throw new Error(`Unknown mailbox: ${mailboxId}`);
    }

    return updated;
  });

export const deleteMailbox = (
  workspaceSlug: string,
  mailboxId: string,
): Promise<DeleteMailboxOutcome> =>
  scoped(workspaceSlug, () => {
    mailboxStore = mailboxStore.filter((mailbox) => mailbox.id !== mailboxId);

    const disconnectedAt = new Date();

    return {
      mailboxId,
      disconnectedAt: disconnectedAt.toISOString(),
      recoverableUntil: new Date(
        disconnectedAt.getTime() + RECOVERY_WINDOW_DAYS * DAY_MS,
      ).toISOString(),
    };
  });

export const connectMailbox = (
  workspaceSlug: string,
  input: ConnectMailboxInput,
): Promise<ConnectMailboxOutcome> =>
  scoped(workspaceSlug, () => {
    const provider = PLACEHOLDER_PROVIDERS.find(
      (candidate) => candidate.id === input.providerId,
    );

    return {
      status:
        provider?.authMethod === "oauth" ? "consent-required" : "verifying",
      providerId: input.providerId,
      consentUrl: null,
      verification: buildVerificationSteps(input.address),
    };
  });
