"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { WorkspaceMember } from "../types/emailAccount.types";
import { emailAccountsKeys } from "../api/emailAccountsKeys";
import { fetchWorkspaceMembers } from "../api/emailAccountsService";

const STALE_TIME_MS = 5 * 60_000;

export const useWorkspaceMembers = (
  workspaceSlug: string,
): UseQueryResult<readonly WorkspaceMember[]> =>
  useQuery({
    queryKey: emailAccountsKeys.members(workspaceSlug),
    queryFn: () => fetchWorkspaceMembers(workspaceSlug),
    staleTime: STALE_TIME_MS,
  });
