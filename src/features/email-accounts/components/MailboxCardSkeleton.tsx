import { Skeleton } from "@/shared/ui/skeleton";

const MailboxCardSkeleton = () => {
  return (
    <div className="flex flex-col gap-card rounded-5xl border border-border-card bg-card p-panel">
      <div className="flex items-start gap-3">
        <Skeleton className="size-9.5 flex-none rounded-3xl" />
        <div className="min-w-0 flex-1">
          <Skeleton className="h-3.5 w-36 max-w-full" />
          <Skeleton className="mt-1.5 h-3 w-48 max-w-full" />
          <Skeleton className="mt-2.5 h-4 w-28 rounded-pill" />
        </div>
        <Skeleton className="h-5 w-16 flex-none rounded-pill" />
      </div>

      <div className="grid grid-cols-2 gap-row">
        <Skeleton className="h-11 rounded-2xl" />
        <Skeleton className="h-11 rounded-2xl" />
      </div>

      <div>
        <Skeleton className="mb-1.25 h-2.5 w-full" />
        <Skeleton className="h-1.25 w-full rounded-sm" />
      </div>

      <div className="flex items-center gap-2 border-t border-border-1 pt-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="ms-auto h-control-sm w-14 rounded-lg" />
        <Skeleton className="h-control-sm w-16 rounded-lg" />
      </div>
    </div>
  );
};

export default MailboxCardSkeleton;
