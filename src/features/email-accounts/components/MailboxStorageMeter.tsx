import { cn } from "@/shared/lib/utils";
import {
  formatStorageText,
  isStorageUnderPressure,
  storageUsagePercent,
} from "../lib/emailAccountFormat";
import type { Mailbox } from "../types/emailAccount.types";

export interface MailboxStorageMeterProps {
  readonly mailbox: Mailbox;
}

const MailboxStorageMeter = ({ mailbox }: MailboxStorageMeterProps) => {
  const percent = storageUsagePercent(mailbox);
  const storageText = formatStorageText(mailbox);

  return (
    <div>
      <div className="mb-1.25 flex items-baseline justify-between gap-2 font-mono text-xs font-semibold text-eyebrow">
        <span>STORAGE</span>
        <span className="truncate">{storageText}</span>
      </div>
      <div
        role="progressbar"
        aria-label={`Storage used by ${mailbox.address}`}
        aria-valuemin={0}
        aria-valuemax={mailbox.storageQuotaGb}
        aria-valuenow={mailbox.storageUsedGb}
        aria-valuetext={storageText}
        className="h-1.25 overflow-hidden rounded-sm bg-surface-6"
      >
        <div
          className={cn(
            "h-full rounded-sm",
            isStorageUnderPressure(mailbox) ? "bg-danger-600" : "bg-accent-500",
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

export default MailboxStorageMeter;
