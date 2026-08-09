const FALLBACK_MONOGRAM = "WS";
const NON_ALPHANUMERIC = /[^\p{L}\p{N}]+/u;

export const workspaceMonogram = (
  workspaceSlug: string | null | undefined,
): string => {
  const words = (workspaceSlug ?? "").split(NON_ALPHANUMERIC).filter(Boolean);

  if (words.length === 0) {
    return FALLBACK_MONOGRAM;
  }

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0].charAt(0)}${words[1].charAt(0)}`.toUpperCase();
};
