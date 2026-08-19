import { MailboxCardSkeleton } from "@/features/email-accounts";
import { Skeleton } from "@/shared/ui/skeleton";

const MAILBOX_SKELETONS = [0, 1, 2, 3];

const EmailAccountsLoading = () => {
  return (
    <div
      role="status"
      aria-label="Loading email connections"
      className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-canvas"
    >
      <header className="flex flex-none flex-wrap items-end justify-between gap-x-4.5 gap-y-3 border-b border-border-card bg-card px-gutter pt-gutter pb-panel">
        <div className="min-w-0">
          <Skeleton className="h-5 w-48 max-w-full" />
          <Skeleton className="mt-2.5 h-3 w-136 max-w-full" />
        </div>
        <Skeleton className="h-10 w-44 flex-none rounded-3xl" />
      </header>

      <div className="px-gutter py-gutter">
        <div className="flex min-w-0 flex-col gap-2.75">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-6 w-36" />

          <div className="@container">
            <div className="grid grid-cols-1 gap-stack @4xl:grid-cols-2">
              {MAILBOX_SKELETONS.map((index) => (
                <MailboxCardSkeleton key={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAccountsLoading;
