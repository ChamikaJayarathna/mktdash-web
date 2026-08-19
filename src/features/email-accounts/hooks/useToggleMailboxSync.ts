"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { Mailbox } from "../types/emailAccount.types";
import { emailAccountsKeys } from "../api/emailAccountsKeys";
import { setMailboxSync } from "../api/emailAccountsService";

export interface ToggleMailboxSyncVariables {
  readonly mailboxId: string;
  readonly address: string;
  readonly isSyncing: boolean;
}

interface ToggleMailboxSyncContext {
  readonly previousMailboxes: readonly Mailbox[] | undefined;
}

export const useToggleMailboxSync = (
  workspaceSlug: string,
): UseMutationResult<
  Mailbox,
  Error,
  ToggleMailboxSyncVariables,
  ToggleMailboxSyncContext
> => {
  const queryClient = useQueryClient();
  const mailboxesKey = emailAccountsKeys.mailboxes(workspaceSlug);

  return useMutation({
    mutationFn: ({ mailboxId, isSyncing }: ToggleMailboxSyncVariables) =>
      setMailboxSync(workspaceSlug, mailboxId, isSyncing),
    onMutate: async ({ mailboxId, isSyncing }) => {
      await queryClient.cancelQueries({ queryKey: mailboxesKey });

      const previousMailboxes =
        queryClient.getQueryData<readonly Mailbox[]>(mailboxesKey);

      queryClient.setQueryData<readonly Mailbox[]>(mailboxesKey, (mailboxes) =>
        (mailboxes ?? []).map((mailbox) =>
          mailbox.id === mailboxId ? { ...mailbox, isSyncing } : mailbox,
        ),
      );

      return { previousMailboxes };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousMailboxes) {
        queryClient.setQueryData(mailboxesKey, context.previousMailboxes);
      }
    },
    onSuccess: (updated) => {
      queryClient.setQueryData<readonly Mailbox[]>(mailboxesKey, (mailboxes) =>
        (mailboxes ?? []).map((mailbox) =>
          mailbox.id === updated.id && updated.updatedAt >= mailbox.updatedAt
            ? updated
            : mailbox,
        ),
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: mailboxesKey });
    },
  });
};
