import { MailboxCardSkeleton } from "@/features/email-accounts";
import { Skeleton } from "@/shared/ui/skeleton";

const PROVIDER_SKELETONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const MAILBOX_SKELETONS = [0, 1, 2, 3];

const EmailAccountsLoading = () => {
  return (
    <div
      role="status"
      aria-label="Loading email connections"
      className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-canvas"
    >
      <header className="flex-none border-b border-border-card bg-card px-gutter pt-gutter pb-panel">
        <Skeleton className="h-5 w-48 max-w-full" />
        <Skeleton className="mt-2.5 h-3 w-136 max-w-full" />
      </header>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] items-start gap-gutter px-gutter py-gutter">
        <div className="flex min-w-0 flex-col gap-2.75">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-6 w-44" />
          <div className="flex flex-col gap-4.5 rounded-5xl border border-border-card bg-card p-4.5">
            <div className="grid grid-cols-[repeat(auto-fill,minmax(168px,1fr))] gap-row">
              {PROVIDER_SKELETONS.map((index) => (
                <Skeleton key={index} className="h-13.5 rounded-3xl" />
              ))}
            </div>
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-20 w-full rounded-3xl" />
            <Skeleton className="h-11.5 w-full rounded-3xl" />
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-2.75">
          <Skeleton className="h-2.5 w-24" />
          <Skeleton className="h-6 w-36" />
          <div className="flex flex-col gap-stack">
            {MAILBOX_SKELETONS.map((index) => (
              <MailboxCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailAccountsLoading;
