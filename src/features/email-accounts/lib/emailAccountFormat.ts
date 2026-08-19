import type { Mailbox, ProviderTone } from "../types/emailAccount.types";

export const providerToneClasses: Record<ProviderTone, string> = {
  accent: "bg-accent-050 text-accent-500",
  danger: "bg-danger-050 text-danger-600",
  success: "bg-success-050 text-success-600",
  warning: "bg-warning-050 text-warning-700",
  violet: "bg-cat-violet-050 text-cat-violet-600",
  neutral: "bg-surface-6 text-text-5",
};

export const STORAGE_PRESSURE_PERCENT = 80;

export const storageUsagePercent = (mailbox: Mailbox): number => {
  if (mailbox.storageQuotaGb <= 0) {
    return 0;
  }

  const percent = Math.round(
    (mailbox.storageUsedGb / mailbox.storageQuotaGb) * 100,
  );

  return Math.min(100, Math.max(0, percent));
};

export const isStorageUnderPressure = (mailbox: Mailbox): boolean =>
  storageUsagePercent(mailbox) > STORAGE_PRESSURE_PERCENT;

export const formatStorageText = (mailbox: Mailbox): string =>
  `${mailbox.storageUsedGb} GB of ${mailbox.storageQuotaGb} GB`;

export const syncStateLabel = (mailbox: Mailbox): string =>
  mailbox.isSyncing ? "Auto sync on" : "Sync paused";

export const formatEndpoint = (host: string, port: number): string =>
  `${host}:${port}`;

export const initialsOf = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
