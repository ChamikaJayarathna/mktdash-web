"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { Mailbox, UpdateMailboxInput } from "../types/emailAccount.types";
import { emailAccountsKeys } from "../api/emailAccountsKeys";
import { updateMailbox } from "../api/emailAccountsService";

interface UpdateMailboxContext {
  readonly previousMailboxes: readonly Mailbox[] | undefined;
}

export const useUpdateMailbox = (
  workspaceSlug: string,
): UseMutationResult<
  Mailbox,
  Error,
  UpdateMailboxInput,
  UpdateMailboxContext
> => {
  const queryClient = useQueryClient();
  const listKey = emailAccountsKeys.mailboxes(workspaceSlug);

  return useMutation({
    mutationFn: (input: UpdateMailboxInput) =>
      updateMailbox(workspaceSlug, input),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: listKey });

      const previousMailboxes =
        queryClient.getQueryData<readonly Mailbox[]>(listKey);

      queryClient.setQueryData<readonly Mailbox[]>(listKey, (mailboxes) =>
        (mailboxes ?? []).map((mailbox) =>
          mailbox.id === input.mailboxId
            ? {
                ...mailbox,
                displayName: input.displayName,
                dailyCap: input.dailyCap,
                sendingWindow: input.sendingWindow,
                scopeId: input.scopeId,
                grants: input.grants,
              }
            : mailbox,
        ),
      );

      return { previousMailboxes };
    },
    onError: (_error, _input, context) => {
      if (context?.previousMailboxes) {
        queryClient.setQueryData(listKey, context.previousMailboxes);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: listKey });
    },
  });
};
