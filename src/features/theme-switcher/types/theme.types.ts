import type { LucideIcon } from "lucide-react";

export type ThemeMode = "light" | "dark" | "system";

export type ResolvedThemeMode = Exclude<ThemeMode, "system">;

export interface ThemeModeOption {
  readonly value: ThemeMode;
  readonly label: string;
  readonly note: string;
  readonly icon: LucideIcon;
}

export interface ThemeModeState {
  readonly mode: ThemeMode | null;
  readonly resolvedMode: ResolvedThemeMode | null;
  readonly isReady: boolean;
  readonly setMode: (mode: ThemeMode) => void;
}
