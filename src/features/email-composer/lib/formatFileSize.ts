const UNITS = ["B", "KB", "MB", "GB"] as const;

export const formatFileSize = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B";
  }

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    UNITS.length - 1,
  );
  const value = bytes / 1024 ** exponent;

  return `${exponent === 0 ? value : Number(value.toFixed(value < 10 ? 1 : 0))} ${UNITS[exponent]}`;
};

export const formatSavedAgo = (savedAt: string, now: Date): string => {
  const elapsedMs = now.getTime() - new Date(savedAt).getTime();
  const seconds = Math.max(Math.round(elapsedMs / 1000), 0);

  if (seconds < 5) {
    return "just now";
  }

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  const minutes = Math.round(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  return `${Math.round(minutes / 60)}h ago`;
};
