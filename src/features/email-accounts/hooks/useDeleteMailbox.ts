"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type {
  DeleteMailboxOutcome,
  Mailbox,
} from "../types/emailAccount.types";
import { emailAccountsKeys } from "../api/emailAccountsKeys";
import { deleteMailbox } from "../api/emailAccountsService";

export interface DeleteMailboxVariables {
  readonly mailboxId: string;
  readonly address: string;
}

interface DeleteMailboxContext {
  readonly previousMailboxes: readonly Mailbox[] | undefined;
}

export const useDeleteMailbox = (
  workspaceSlug: string,
): UseMutationResult<
  DeleteMailboxOutcome,
  Error,
  DeleteMailboxVariables,
  DeleteMailboxContext
> => {
  const queryClient = useQueryClient();
  const mailboxesKey = emailAccountsKeys.mailboxes(workspaceSlug);

  return useMutation({
    mutationFn: ({ mailboxId }: DeleteMailboxVariables) =>
      deleteMailbox(workspaceSlug, mailboxId),
    onMutate: async ({ mailboxId }) => {
      await queryClient.cancelQueries({ queryKey: mailboxesKey });

      const previousMailboxes =
        queryClient.getQueryData<readonly Mailbox[]>(mailboxesKey);

      queryClient.setQueryData<readonly Mailbox[]>(mailboxesKey, (mailboxes) =>
        (mailboxes ?? []).filter((mailbox) => mailbox.id !== mailboxId),
      );

      return { previousMailboxes };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousMailboxes) {
        queryClient.setQueryData(mailboxesKey, context.previousMailboxes);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: mailboxesKey });
    },
  });
};
