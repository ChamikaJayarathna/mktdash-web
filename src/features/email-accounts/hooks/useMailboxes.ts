"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { Mailbox } from "../types/emailAccount.types";
import { emailAccountsKeys } from "../api/emailAccountsKeys";
import { fetchMailboxes } from "../api/emailAccountsService";

const STALE_TIME_MS = 30_000;

export const useMailboxes = (
  workspaceSlug: string,
): UseQueryResult<readonly Mailbox[]> =>
  useQuery({
    queryKey: emailAccountsKeys.mailboxes(workspaceSlug),
    queryFn: () => fetchMailboxes(workspaceSlug),
    staleTime: STALE_TIME_MS,
  });
