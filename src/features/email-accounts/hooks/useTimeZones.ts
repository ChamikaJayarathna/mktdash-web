"use client";

import { useEffect, useState } from "react";
import {
  sortTimeZoneOptions,
  toTimeZoneOption,
  type TimeZoneOption,
} from "../lib/timeZones";

export interface UseTimeZonesResult {
  readonly options: readonly TimeZoneOption[];
  readonly isLoading: boolean;
}

export const useTimeZones = (enabled: boolean): UseTimeZonesResult => {
  const [options, setOptions] = useState<readonly TimeZoneOption[]>([]);

  useEffect(() => {
    if (!enabled || options.length > 0) {
      return;
    }

    let isActive = true;

    void import("@vvo/tzdb").then(({ getTimeZones }) => {
      if (!isActive) {
        return;
      }

      setOptions(sortTimeZoneOptions(getTimeZones().map(toTimeZoneOption)));
    });

    return () => {
      isActive = false;
    };
  }, [enabled, options.length]);

  return { options, isLoading: enabled && options.length === 0 };
};
