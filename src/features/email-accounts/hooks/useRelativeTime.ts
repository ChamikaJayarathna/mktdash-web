"use client";

import { useEffect, useState } from "react";
import { formatSyncAgo } from "../lib/relativeTime";

const REFRESH_INTERVAL_MS = 30_000;

export const useRelativeTime = (isoDate: string): string => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(new Date());
    }, REFRESH_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  return formatSyncAgo(isoDate, now);
};
