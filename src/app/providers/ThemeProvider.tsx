"use client";

import type { ReactNode } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

const THEME_STORAGE_KEY = "mktdash-theme";

export interface ThemeProviderProps {
  readonly children: ReactNode;
  readonly forcedTheme?: "light" | "dark";
}

const ThemeProvider = ({ children, forcedTheme }: ThemeProviderProps) => {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={forcedTheme ?? "system"}
      enableSystem={forcedTheme === undefined}
      enableColorScheme
      disableTransitionOnChange
      storageKey={THEME_STORAGE_KEY}
      forcedTheme={forcedTheme}
    >
      {children}
    </NextThemesProvider>
  );
};

export default ThemeProvider;
