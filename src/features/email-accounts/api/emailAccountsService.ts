import type {
  ConnectMailboxInput,
  ConnectMailboxOutcome,
  DeleteMailboxOutcome,
  EmailProvider,
  Mailbox,
  UpdateMailboxInput,
  WorkspaceMember,
} from "../types/emailAccount.types";
import { MailboxConflictError } from "../types/emailAccount.types";
import { buildVerificationSteps } from "../lib/scopeLevels";
import {
  DEFAULT_ORGANISATION_ID,
  PLACEHOLDER_MAILBOXES,
  PLACEHOLDER_MEMBERS,
  PLACEHOLDER_PROVIDERS,
  WORKSPACE_ORGANISATIONS,
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

export const resolveOrganisationId = (workspaceSlug: string): string =>
  WORKSPACE_ORGANISATIONS[workspaceSlug] ?? DEFAULT_ORGANISATION_ID;

export const fetchWorkspaceMembers = (
  workspaceSlug: string,
): Promise<readonly WorkspaceMember[]> => {
  const organisationId = resolveOrganisationId(workspaceSlug);

  return scoped(workspaceSlug, () =>
    PLACEHOLDER_MEMBERS.filter(
      (member) => member.organisationId === organisationId,
    ),
  );
};

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

export const updateMailbox = (
  workspaceSlug: string,
  input: UpdateMailboxInput,
): Promise<Mailbox> =>
  scoped(workspaceSlug, () => {
    const current = mailboxStore.find(
      (mailbox) => mailbox.id === input.mailboxId,
    );

    if (!current) {
      throw new Error(`Unknown mailbox: ${input.mailboxId}`);
    }

    if (current.updatedAt !== input.expectedUpdatedAt) {
      throw new MailboxConflictError(current);
    }

    const updated: Mailbox = {
      ...current,
      displayName: input.displayName,
      dailyCap: input.dailyCap,
      sendingWindow: input.sendingWindow,
      scopeId: input.scopeId,
      grants: input.grants,
      updatedAt: new Date().toISOString(),
    };

    mailboxStore = mailboxStore.map((mailbox) =>
      mailbox.id === updated.id ? updated : mailbox,
    );

    return updated;
  });
