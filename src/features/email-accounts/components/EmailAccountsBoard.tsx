"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatDayStamp } from "@/shared/lib/formatDateTime";
import { useDeleteMailbox } from "../hooks/useDeleteMailbox";
import { useEmailProviders } from "../hooks/useEmailProviders";
import { useWorkspaceMembers } from "../hooks/useWorkspaceMembers";
import { useMailboxes } from "../hooks/useMailboxes";
import { useToggleMailboxSync } from "../hooks/useToggleMailboxSync";
import { useUpdateMailbox } from "../hooks/useUpdateMailbox";
import { MailboxConflictError } from "../types/emailAccount.types";
import type { Mailbox, UpdateMailboxInput } from "../types/emailAccount.types";
import DeleteMailboxDialog from "./DeleteMailboxDialog";
import EditMailboxDialog from "./EditMailboxDialog";
import MailboxList from "./MailboxList";

export interface EmailAccountsBoardProps {
  readonly workspaceSlug: string;
}

const VIEWER_TIME_ZONE = "Europe/London";

const EmailAccountsBoard = ({ workspaceSlug }: EmailAccountsBoardProps) => {
  const mailboxesQuery = useMailboxes(workspaceSlug);
  const providersQuery = useEmailProviders(workspaceSlug);
  const membersQuery = useWorkspaceMembers(workspaceSlug);
  const toggleSyncMutation = useToggleMailboxSync(workspaceSlug);
  const deleteMutation = useDeleteMailbox(workspaceSlug);
  const updateMutation = useUpdateMailbox(workspaceSlug);

  const [mailboxToDelete, setMailboxToDelete] = useState<Mailbox | null>(null);
  const [mailboxToEdit, setMailboxToEdit] = useState<Mailbox | null>(null);

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

  const handleSave = (input: UpdateMailboxInput) => {
    const address = mailboxToEdit?.address ?? "This mailbox";

    updateMutation.mutate(input, {
      onSuccess: () => {
        setMailboxToEdit(null);
        toast.success(`${address} updated`, {
          description:
            "Caps, sending window and grants take effect on the next send.",
        });
      },
      onError: (error) => {
        if (error instanceof MailboxConflictError) {
          setMailboxToEdit(error.latest);
          toast.error(`${address} was changed by someone else`, {
            description:
              "Your edits were not saved. The form now shows their version — reapply your changes and save again.",
          });
          return;
        }

        toast.error(`${address} could not be updated`, {
          description:
            "Nothing changed — the mailbox kept its previous settings.",
        });
      },
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
        onEdit={setMailboxToEdit}
        onDelete={setMailboxToDelete}
      />

      <EditMailboxDialog
        mailbox={mailboxToEdit}
        provider={
          providersQuery.data?.find(
            (candidate) => candidate.id === mailboxToEdit?.providerId,
          ) ?? null
        }
        members={membersQuery.data ?? []}
        isLoadingMembers={membersQuery.isPending}
        isSaving={updateMutation.isPending}
        onSave={handleSave}
        onOpenChange={(open) => {
          if (!open && !updateMutation.isPending) {
            setMailboxToEdit(null);
          }
        }}
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
