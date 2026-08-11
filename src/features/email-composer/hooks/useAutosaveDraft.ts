"use client";

import { useEffect, useRef } from "react";
import { useSaveDraft } from "../api/useSaveDraft";
import { useEmailComposerStore } from "../store/emailComposer.store";
import type { EmailDraft } from "../types/emailComposer.types";

const AUTOSAVE_DELAY_MS = 1_200;

export const isDraftWorthSaving = (draft: EmailDraft): boolean =>
  draft.to.length > 0 ||
  draft.cc.length > 0 ||
  draft.bcc.length > 0 ||
  draft.subject.trim().length > 0 ||
  draft.bodyText.trim().length > 0 ||
  draft.attachments.length > 0;

export interface UseAutosaveDraftOptions {
  readonly sessionId: string;
  readonly workspaceSlug: string;
  readonly draft: EmailDraft;
  readonly isEnabled: boolean;
}

export const useAutosaveDraft = ({
  sessionId,
  workspaceSlug,
  draft,
  isEnabled,
}: UseAutosaveDraftOptions): void => {
  const { mutate } = useSaveDraft(workspaceSlug);
  const setSaveState = useEmailComposerStore((state) => state.setSaveState);
  const mutateRef = useRef(mutate);
  const lastSavedRef = useRef<string | null>(null);

  useEffect(() => {
    mutateRef.current = mutate;
  }, [mutate]);

  useEffect(() => {
    if (
      !isEnabled ||
      lastSavedRef.current === draft.updatedAt ||
      !isDraftWorthSaving(draft)
    ) {
      return;
    }

    const timer = setTimeout(() => {
      lastSavedRef.current = draft.updatedAt;
      setSaveState(sessionId, "saving");

      mutateRef.current(draft, {
        onSuccess: (outcome) =>
          setSaveState(sessionId, "saved", outcome.savedAt),
        onError: () => {
          lastSavedRef.current = null;
          setSaveState(sessionId, "error");
        },
      });
    }, AUTOSAVE_DELAY_MS);

    return () => clearTimeout(timer);
  }, [draft, isEnabled, sessionId, setSaveState]);
};
