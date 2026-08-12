"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type { EmailDraft, SendOutcome } from "../types/emailComposer.types";
import { emailComposerKeys } from "./emailComposerKeys";
import { cancelSend, sendEmail } from "./emailComposerService";

export const useSendEmail = (
  workspaceSlug: string,
): UseMutationResult<SendOutcome, Error, EmailDraft> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...emailComposerKeys.all(workspaceSlug), "send"],
    mutationFn: (draft: EmailDraft) => sendEmail(workspaceSlug, draft),
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: emailComposerKeys.all(workspaceSlug),
      });
    },
  });
};

export const useCancelSend = (
  workspaceSlug: string,
): UseMutationResult<boolean, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...emailComposerKeys.all(workspaceSlug), "cancel-send"],
    mutationFn: (messageId: string) => cancelSend(workspaceSlug, messageId),
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: emailComposerKeys.all(workspaceSlug),
      });
    },
  });
};
