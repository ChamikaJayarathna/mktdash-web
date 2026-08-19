import { MailPlus } from "lucide-react";

const EmailAccountsEmptyState = () => {
  return (
    <div className="flex animate-fa-in flex-col items-center rounded-5xl border border-dashed border-border-6 bg-surface-1 px-gutter py-10 text-center">
      <MailPlus
        aria-hidden
        className="size-6 text-accent-500"
        strokeWidth={1.6}
      />
      <p className="type-h2 mt-2.5 text-heading">No mailbox connected yet</p>
      <p className="mt-1.5 max-w-[34em] text-base leading-relaxed text-body">
        Nothing can be sent from this workspace until at least one mailbox is
        connected. Pick a provider on the left — it takes about a minute.
      </p>
    </div>
  );
};

export default EmailAccountsEmptyState;
