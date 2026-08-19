"use client";

import { CircleAlert } from "lucide-react";
import { Button } from "@/shared/ui/button";

export interface EmailAccountsErrorStateProps {
  readonly onRetry: () => void;
  readonly isRetrying?: boolean;
}

const EmailAccountsErrorState = ({
  onRetry,
  isRetrying = false,
}: EmailAccountsErrorStateProps) => {
  return (
    <div
      role="alert"
      className="flex animate-fa-in flex-col items-center rounded-5xl border border-danger-100 bg-danger-050 px-gutter py-10 text-center"
    >
      <CircleAlert
        aria-hidden
        className="size-6 text-danger-600"
        strokeWidth={1.6}
      />
      <p className="type-h2 mt-2.5 text-danger-600">
        Mailboxes could not be loaded
      </p>
      <p className="mt-1.5 max-w-[34em] text-base leading-relaxed text-body">
        Nothing was changed. Your mailboxes are still connected and syncing —
        this screen just could not read their current state.
      </p>
      <Button
        variant="outline"
        size="sm"
        className="mt-3.75"
        disabled={isRetrying}
        onClick={onRetry}
      >
        {isRetrying ? "Retrying…" : "Try again"}
      </Button>
    </div>
  );
};

export default EmailAccountsErrorState;
