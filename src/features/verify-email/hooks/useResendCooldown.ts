"use client";

import { useCallback, useEffect, useState } from "react";

export interface ResendCooldown {
  readonly secondsRemaining: number;
  readonly isCoolingDown: boolean;
  readonly start: (seconds: number) => void;
}

export const useResendCooldown = (): ResendCooldown => {
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    if (secondsRemaining <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setSecondsRemaining((remaining) => Math.max(0, remaining - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [secondsRemaining]);

  const start = useCallback((seconds: number) => {
    setSecondsRemaining(Math.max(0, Math.trunc(seconds)));
  }, []);

  return {
    secondsRemaining,
    isCoolingDown: secondsRemaining > 0,
    start,
  };
};
