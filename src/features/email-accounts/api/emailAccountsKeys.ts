export const emailAccountsKeys = {
  all: (workspaceSlug: string) => ["email-accounts", workspaceSlug] as const,
  providers: (workspaceSlug: string) =>
    [...emailAccountsKeys.all(workspaceSlug), "providers"] as const,
  mailboxes: (workspaceSlug: string) =>
    [...emailAccountsKeys.all(workspaceSlug), "mailboxes"] as const,
} as const;
