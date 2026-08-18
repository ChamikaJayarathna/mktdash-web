"use client";

import { useState } from "react";
import { toast } from "sonner";
import { formatDayStamp } from "@/shared/lib/formatDateTime";
import { useConnectMailbox } from "../hooks/useConnectMailbox";
import { useDeleteMailbox } from "../hooks/useDeleteMailbox";
import { useEmailProviders } from "../hooks/useEmailProviders";
import { useMailboxes } from "../hooks/useMailboxes";
import { useToggleMailboxSync } from "../hooks/useToggleMailboxSync";
import type { ConnectMailboxInput, Mailbox } from "../types/emailAccount.types";
import AddAccountPanel from "./AddAccountPanel";
import DeleteMailboxDialog from "./DeleteMailboxDialog";
import MailboxList from "./MailboxList";

export interface EmailAccountsBoardProps {
  readonly workspaceSlug: string;
}

const VIEWER_TIME_ZONE = "Europe/London";

const EmailAccountsBoard = ({ workspaceSlug }: EmailAccountsBoardProps) => {
  const providersQuery = useEmailProviders(workspaceSlug);
  const mailboxesQuery = useMailboxes(workspaceSlug);
  const connectMutation = useConnectMailbox(workspaceSlug);
  const toggleSyncMutation = useToggleMailboxSync(workspaceSlug);
  const deleteMutation = useDeleteMailbox(workspaceSlug);

  const [mailboxToDelete, setMailboxToDelete] = useState<Mailbox | null>(null);

  const providers = providersQuery.data ?? [];
  const mailboxes = mailboxesQuery.data ?? [];
  const deletingMailboxId = deleteMutation.isPending
    ? (deleteMutation.variables?.mailboxId ?? null)
    : null;

  const handleConnect = (input: ConnectMailboxInput) => {
    const provider = providers.find(
      (candidate) => candidate.id === input.providerId,
    );

    connectMutation.mutate(input, {
      onSuccess: (outcome) => {
        toast(
          outcome.status === "consent-required"
            ? `Opening the ${provider?.name ?? "provider"} consent screen…`
            : `Verifying ${provider?.name ?? "provider"} credentials…`,
          {
            description:
              "SPF, DKIM and DMARC are checked on connect, then a conservative warmup starts.",
          },
        );
      },
      onError: () => {
        toast.error(`${input.address} could not be connected`, {
          description: "Nothing was saved — check the credentials and retry.",
        });
      },
    });
  };

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
    <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-gutter px-gutter py-gutter">
      <AddAccountPanel
        providers={providers}
        isLoading={providersQuery.isPending}
        isConnecting={connectMutation.isPending}
        onConnect={handleConnect}
      />

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
