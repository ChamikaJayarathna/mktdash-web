"use client";

import { useId } from "react";
import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Switch } from "@/shared/ui/switch";
import { useRelativeTime } from "../hooks/useRelativeTime";
import { syncStateLabel } from "../lib/emailAccountFormat";
import type { Mailbox } from "../types/emailAccount.types";
import MailboxEndpointBox from "./MailboxEndpointBox";
import MailboxStorageMeter from "./MailboxStorageMeter";

export interface MailboxCardProps {
  readonly mailbox: Mailbox;
  readonly isDeleting?: boolean;
  readonly onToggleSync: (mailbox: Mailbox, isSyncing: boolean) => void;
  readonly onEdit: (mailbox: Mailbox) => void;
  readonly onDelete: (mailbox: Mailbox) => void;
}

const MailboxCard = ({
  mailbox,
  isDeleting = false,
  onToggleSync,
  onEdit,
  onDelete,
}: MailboxCardProps) => {
  const headingId = useId();

  const syncedAgo = useRelativeTime(mailbox.lastSyncedAt);

  return (
    <article
      aria-labelledby={headingId}
      className="flex animate-fa-in flex-col gap-card rounded-5xl border border-border-card bg-card p-panel shadow-hairline transition-colors duration-(--dur-hover) ease-out hover:border-accent-150"
    >
      <div className="flex items-start gap-3">
        <span
          aria-hidden
          className={cn(
            "grid size-9.5 flex-none place-items-center rounded-3xl text-base font-extrabold",
            mailbox.isSyncing
              ? "bg-brand-gradient text-white"
              : "bg-border-5 text-meta",
          )}
        >
          {mailbox.monogram}
        </span>

        <div className="min-w-0 flex-1">
          <h3 id={headingId} className="type-h2 truncate text-heading">
            {mailbox.displayName}
          </h3>
          <p className="mt-0.5 truncate font-mono text-sm font-medium text-meta">
            {mailbox.address}
          </p>

          <div className="mt-2 flex flex-wrap items-center gap-1.75">
            <Badge
              variant={mailbox.isSyncing ? "success" : "neutral"}
              size="md"
              className="font-bold"
            >
              {syncStateLabel(mailbox)}
            </Badge>
            <span className="font-mono text-xs font-medium text-eyebrow">
              synced <span suppressHydrationWarning>{syncedAgo}</span>
            </span>
          </div>
        </div>

        <div className="flex flex-none items-center gap-1.75">
          <span
            aria-hidden
            className="text-xs font-bold text-text-5 select-none"
          >
            Sync
          </span>
          <Switch
            checked={mailbox.isSyncing}
            aria-label={`Sync ${mailbox.address}`}
            onCheckedChange={(checked) => onToggleSync(mailbox, checked)}
          />
        </div>
      </div>

      <dl className="grid grid-cols-2 gap-row">
        <MailboxEndpointBox label="IMAP" value={mailbox.imapEndpoint} />
        <MailboxEndpointBox label="SMTP" value={mailbox.smtpEndpoint} />
      </dl>

      <MailboxStorageMeter mailbox={mailbox} />

      <div className="flex flex-wrap items-center gap-2 border-t border-border-1 pt-3">
        <span className="text-xs font-medium text-eyebrow">
          {mailbox.providerLabel}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="ms-auto"
          onClick={() => onEdit(mailbox)}
        >
          Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          disabled={isDeleting}
          onClick={() => onDelete(mailbox)}
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </Button>
      </div>
    </article>
  );
};

export default MailboxCard;
