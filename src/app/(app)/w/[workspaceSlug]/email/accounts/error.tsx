"use client";

import { EmailAccountsErrorState } from "@/features/email-accounts";

export interface EmailAccountsErrorProps {
  readonly error: Error;
  readonly reset: () => void;
}

const EmailAccountsError = ({ reset }: EmailAccountsErrorProps) => {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-canvas">
      <header className="flex-none border-b border-border-card bg-card px-gutter pt-gutter pb-panel">
        <h1 className="type-h1 text-heading">Email connections</h1>
      </header>

      <div className="px-gutter py-gutter">
        <EmailAccountsErrorState onRetry={reset} />
      </div>
    </div>
  );
};

export default EmailAccountsError;
