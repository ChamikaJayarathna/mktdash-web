"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { EmailProvider } from "../types/emailAccount.types";
import { emailAccountsKeys } from "../api/emailAccountsKeys";
import { fetchEmailProviders } from "../api/emailAccountsService";

const STALE_TIME_MS = 5 * 60_000;

export const useEmailProviders = (
  workspaceSlug: string,
): UseQueryResult<readonly EmailProvider[]> =>
  useQuery({
    queryKey: emailAccountsKeys.providers(workspaceSlug),
    queryFn: () => fetchEmailProviders(workspaceSlug),
    staleTime: STALE_TIME_MS,
  });
