"use client";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import type {
  ConnectMailboxInput,
  ConnectMailboxOutcome,
} from "../types/emailAccount.types";
import { connectMailbox } from "../api/emailAccountsService";

export const useConnectMailbox = (
  workspaceSlug: string,
): UseMutationResult<ConnectMailboxOutcome, Error, ConnectMailboxInput> =>
  useMutation({
    mutationFn: (input: ConnectMailboxInput) =>
      connectMailbox(workspaceSlug, input),
  });
