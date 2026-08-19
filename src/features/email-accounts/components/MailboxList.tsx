"use client";

import type { Mailbox } from "../types/emailAccount.types";
import MailboxCard from "./MailboxCard";
import MailboxCardSkeleton from "./MailboxCardSkeleton";
import EmailAccountsEmptyState from "./EmailAccountsEmptyState";
import EmailAccountsErrorState from "./EmailAccountsErrorState";

export interface MailboxListProps {
  readonly mailboxes: readonly Mailbox[];
  readonly isLoading: boolean;
  readonly isError: boolean;
  readonly isRetrying: boolean;
  readonly deletingMailboxId: string | null;
  readonly onRetry: () => void;
  readonly onToggleSync: (mailbox: Mailbox, isSyncing: boolean) => void;
  readonly onEdit: (mailbox: Mailbox) => void;
  readonly onDelete: (mailbox: Mailbox) => void;
}

const MAILBOX_SKELETONS = [0, 1, 2, 3];

const MailboxList = ({
  mailboxes,
  isLoading,
  isError,
  isRetrying,
  deletingMailboxId,
  onRetry,
  onToggleSync,
  onEdit,
  onDelete,
}: MailboxListProps) => {
  return (
    <section
      aria-labelledby="mailboxes-heading"
      className="flex min-w-0 flex-col gap-2.75"
    >
      <div className="flex items-center gap-2.25">
        <p className="font-mono text-xs font-bold tracking-widest text-accent-500">
          CONNECTED
        </p>
        {isLoading || isError ? null : (
          <span className="min-w-5 rounded-pill bg-accent-050 px-1.5 text-center font-mono text-xs leading-5 font-bold text-accent-500">
            {mailboxes.length}
          </span>
        )}
      </div>

      <h2
        id="mailboxes-heading"
        className="text-3xl leading-tight font-extrabold tracking-tight text-heading"
      >
        Mailboxes
      </h2>

      {isLoading ? (
        <div className="@container">
          <div className="grid grid-cols-1 gap-stack @4xl:grid-cols-2">
            {MAILBOX_SKELETONS.map((index) => (
              <MailboxCardSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : null}

      {isError ? (
        <EmailAccountsErrorState isRetrying={isRetrying} onRetry={onRetry} />
      ) : null}

      {!isLoading && !isError && mailboxes.length === 0 ? (
        <EmailAccountsEmptyState />
      ) : null}

      {!isLoading && !isError && mailboxes.length > 0 ? (
        <div className="@container">
          <ul className="grid grid-cols-1 items-start gap-stack @4xl:grid-cols-2">
            {mailboxes.map((mailbox) => (
              <li key={mailbox.id} className="min-w-0">
                <MailboxCard
                  mailbox={mailbox}
                  isDeleting={deletingMailboxId === mailbox.id}
                  onToggleSync={onToggleSync}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
};

export default MailboxList;
