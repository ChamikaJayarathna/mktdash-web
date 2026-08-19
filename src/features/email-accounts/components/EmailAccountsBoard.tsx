"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatDayStamp } from "@/shared/lib/formatDateTime";
import { useDeleteMailbox } from "../hooks/useDeleteMailbox";
import { useMailboxes } from "../hooks/useMailboxes";
import { useToggleMailboxSync } from "../hooks/useToggleMailboxSync";
import type { Mailbox } from "../types/emailAccount.types";
import DeleteMailboxDialog from "./DeleteMailboxDialog";
import MailboxList from "./MailboxList";

export interface EmailAccountsBoardProps {
  readonly workspaceSlug: string;
}

const VIEWER_TIME_ZONE = "Europe/London";

const EmailAccountsBoard = ({ workspaceSlug }: EmailAccountsBoardProps) => {
  const mailboxesQuery = useMailboxes(workspaceSlug);
  const toggleSyncMutation = useToggleMailboxSync(workspaceSlug);
  const deleteMutation = useDeleteMailbox(workspaceSlug);

  const [mailboxToDelete, setMailboxToDelete] = useState<Mailbox | null>(null);

  const mailboxes = mailboxesQuery.data ?? [];
  const deletingMailboxId = deleteMutation.isPending
    ? (deleteMutation.variables?.mailboxId ?? null)
    : null;

  const handleToggleSync = (mailbox: Mailbox, isSyncing: boolean) => {
    toggleSyncMutation.mutate(
      { mailboxId: mailbox.id, address: mailbox.address, isSyncing },
      {
        onSuccess: () => {
          toast.success(
            isSyncing
              ? `Real-time sync resumed for ${mailbox.address}`
              : `Sync paused for ${mailbox.address}`,
          );
        },
        onError: () => {
          toast.error(`Sync could not be changed for ${mailbox.address}`, {
            description:
              "Nothing changed — the mailbox kept its previous state.",
          });
        },
      },
    );
  };

  const handleEdit = (mailbox: Mailbox) => {
    toast(`Editing ${mailbox.address}`, {
      description: "Server settings and sending grants open next.",
    });
  };

  const handleConfirmDelete = (mailbox: Mailbox) => {
    deleteMutation.mutate(
      { mailboxId: mailbox.id, address: mailbox.address },
      {
        onSuccess: (outcome) => {
          setMailboxToDelete(null);
          toast.success(`${mailbox.address} disconnected`, {
            description: `Queued sends were cancelled. Recoverable until ${formatDayStamp(
              outcome.recoverableUntil,
              VIEWER_TIME_ZONE,
            )}.`,
          });
        },
        onError: () => {
          toast.error(`${mailbox.address} could not be disconnected`, {
            description:
              "Nothing changed — the mailbox is still connected and syncing.",
          });
        },
      },
    );
  };

  return (
    <div className="px-gutter py-gutter">
      <MailboxList
        mailboxes={mailboxes}
        isLoading={mailboxesQuery.isPending}
        isError={mailboxesQuery.isError}
        isRetrying={mailboxesQuery.isFetching}
        deletingMailboxId={deletingMailboxId}
        onRetry={() => {
          void mailboxesQuery.refetch();
        }}
        onToggleSync={handleToggleSync}
        onEdit={handleEdit}
        onDelete={setMailboxToDelete}
      />

      <DeleteMailboxDialog
        mailbox={mailboxToDelete}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onOpenChange={(open) => {
          if (!open && !deleteMutation.isPending) {
            setMailboxToDelete(null);
          }
        }}
      />
    </div>
  );
};

export default EmailAccountsBoard;
