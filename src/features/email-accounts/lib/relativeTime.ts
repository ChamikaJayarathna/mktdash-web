const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

export const formatSyncAgo = (isoDate: string, now: Date): string => {
  const elapsed = now.getTime() - new Date(isoDate).getTime();

  if (Number.isNaN(elapsed) || elapsed < 0) {
    return "just now";
  }

  if (elapsed < MINUTE_MS) {
    return `${Math.max(1, Math.floor(elapsed / 1000))}s ago`;
  }

  if (elapsed < HOUR_MS) {
    return `${Math.floor(elapsed / MINUTE_MS)}m ago`;
  }

  if (elapsed < DAY_MS) {
    return `${Math.floor(elapsed / HOUR_MS)}h ago`;
  }

  return `${Math.floor(elapsed / DAY_MS)}d ago`;
};
