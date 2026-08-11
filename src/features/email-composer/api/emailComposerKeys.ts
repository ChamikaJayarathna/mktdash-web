export const emailComposerKeys = {
  all: (workspaceSlug: string) => ["email-composer", workspaceSlug] as const,
  sendingAccounts: (workspaceSlug: string) =>
    [...emailComposerKeys.all(workspaceSlug), "sending-accounts"] as const,
  signatures: (workspaceSlug: string) =>
    [...emailComposerKeys.all(workspaceSlug), "signatures"] as const,
  templates: (workspaceSlug: string) =>
    [...emailComposerKeys.all(workspaceSlug), "templates"] as const,
  suppression: (workspaceSlug: string) =>
    [...emailComposerKeys.all(workspaceSlug), "suppression"] as const,
  contactSuggestions: (workspaceSlug: string, query: string) =>
    [
      ...emailComposerKeys.all(workspaceSlug),
      "contact-suggestions",
      query,
    ] as const,
  drafts: (workspaceSlug: string) =>
    [...emailComposerKeys.all(workspaceSlug), "drafts"] as const,
} as const;
