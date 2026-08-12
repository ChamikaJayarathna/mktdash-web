"use client";

import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from "@tanstack/react-query";
import type {
  EmailDraft,
  SaveDraftOutcome,
} from "../types/emailComposer.types";
import { emailComposerKeys } from "./emailComposerKeys";
import { discardDraft, saveDraft } from "./emailComposerService";

export const useSaveDraft = (
  workspaceSlug: string,
): UseMutationResult<SaveDraftOutcome, Error, EmailDraft> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...emailComposerKeys.drafts(workspaceSlug), "save"],
    mutationFn: (draft: EmailDraft) => saveDraft(workspaceSlug, draft),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: emailComposerKeys.drafts(workspaceSlug),
      });
    },
  });
};

export const useDiscardDraft = (
  workspaceSlug: string,
): UseMutationResult<void, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [...emailComposerKeys.drafts(workspaceSlug), "discard"],
    mutationFn: (draftId: string) => discardDraft(workspaceSlug, draftId),
    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: emailComposerKeys.drafts(workspaceSlug),
      });
    },
  });
};
