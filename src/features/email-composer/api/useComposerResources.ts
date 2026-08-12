"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import type {
  ContactSuggestion,
  EmailSignature,
  EmailTemplateSummary,
} from "../types/emailComposer.types";
import { emailComposerKeys } from "./emailComposerKeys";
import {
  fetchSignatures,
  fetchSuppressedEmails,
  fetchTemplates,
  searchContacts,
} from "./emailComposerService";

const STALE_TIME_MS = 60_000;

export const CONTACT_SEARCH_MIN_LENGTH = 2;

export const useEmailSignatures = (
  workspaceSlug: string,
): UseQueryResult<readonly EmailSignature[]> =>
  useQuery({
    queryKey: emailComposerKeys.signatures(workspaceSlug),
    queryFn: () => fetchSignatures(workspaceSlug),
    staleTime: STALE_TIME_MS,
  });

export const useEmailTemplates = (
  workspaceSlug: string,
): UseQueryResult<readonly EmailTemplateSummary[]> =>
  useQuery({
    queryKey: emailComposerKeys.templates(workspaceSlug),
    queryFn: () => fetchTemplates(workspaceSlug),
    staleTime: STALE_TIME_MS,
  });

export const useSuppressedEmails = (
  workspaceSlug: string,
): UseQueryResult<readonly string[]> =>
  useQuery({
    queryKey: emailComposerKeys.suppression(workspaceSlug),
    queryFn: () => fetchSuppressedEmails(workspaceSlug),
    staleTime: STALE_TIME_MS,
  });

export const useContactSuggestions = (
  workspaceSlug: string,
  query: string,
): UseQueryResult<readonly ContactSuggestion[]> => {
  const trimmed = query.trim();

  return useQuery({
    queryKey: emailComposerKeys.contactSuggestions(workspaceSlug, trimmed),
    queryFn: () => searchContacts(workspaceSlug, trimmed),
    enabled: trimmed.length >= CONTACT_SEARCH_MIN_LENGTH,
    staleTime: STALE_TIME_MS,
  });
};
