import { EmailAccountsBoard } from "@/features/email-accounts";

export interface EmailAccountsPageProps {
  readonly workspaceSlug: string;
}

const EmailAccountsPage = ({ workspaceSlug }: EmailAccountsPageProps) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-canvas">
      <header className="flex-none border-b border-border-card bg-card px-gutter pt-gutter pb-panel">
        <h1 className="type-h1 text-heading">Email connections</h1>
        <p className="mt-1.25 max-w-[62em] text-base leading-relaxed text-text-6">
          Connect as many mailboxes as you need. Each one keeps its own
          reputation, cap, warmup state, and sync status.
        </p>
      </header>

      <EmailAccountsBoard workspaceSlug={workspaceSlug} />
    </div>
  );
};

export default EmailAccountsPage;
