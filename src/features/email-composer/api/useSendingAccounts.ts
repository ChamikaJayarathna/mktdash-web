"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type { SendingAccount } from "../types/emailComposer.types";
import { fetchSendingAccounts } from "./emailComposerService";
import { emailComposerKeys } from "./emailComposerKeys";

const STALE_TIME_MS = 60_000;

export const useSendingAccounts = (
  workspaceSlug: string,
): UseQueryResult<readonly SendingAccount[]> =>
  useQuery({
    queryKey: emailComposerKeys.sendingAccounts(workspaceSlug),
    queryFn: () => fetchSendingAccounts(workspaceSlug),
    staleTime: STALE_TIME_MS,
  });
