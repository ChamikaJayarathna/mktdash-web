const COMPACT_COUNT_THRESHOLD = 1000;

const compactCountFormatter = new Intl.NumberFormat("en-GB", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export const formatSidebarCount = (count: number): string =>
  count >= COMPACT_COUNT_THRESHOLD
    ? compactCountFormatter.format(count).toLowerCase()
    : `${count}`;
