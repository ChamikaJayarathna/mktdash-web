"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { isResolvedThemeMode, isThemeMode } from "../lib/themeOptions";
import type { ThemeModeState } from "../types/theme.types";

const subscribeToNothing = (): (() => void) => () => {};
const getClientSnapshot = (): boolean => true;
const getServerSnapshot = (): boolean => false;

export const useThemeMode = (): ThemeModeState => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isReady = useSyncExternalStore(
    subscribeToNothing,
    getClientSnapshot,
    getServerSnapshot,
  );

  return {
    mode: isReady && isThemeMode(theme) ? theme : null,
    resolvedMode:
      isReady && isResolvedThemeMode(resolvedTheme) ? resolvedTheme : null,
    isReady,
    setMode: setTheme,
  };
};
