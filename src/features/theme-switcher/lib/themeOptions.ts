import { Monitor, Moon, Sun } from "lucide-react";
import type {
  ResolvedThemeMode,
  ThemeMode,
  ThemeModeOption,
} from "../types/theme.types";

export const THEME_MODE_OPTIONS: readonly ThemeModeOption[] = [
  {
    value: "light",
    label: "Light",
    note: "Bright surfaces — easiest in a well-lit room.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    note: "Dimmed surfaces — easier on the eyes after hours.",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    note: "Follows your device and switches when it does.",
    icon: Monitor,
  },
];

const THEME_MODES: readonly string[] = THEME_MODE_OPTIONS.map(
  (option) => option.value,
);

export const isThemeMode = (value: unknown): value is ThemeMode =>
  typeof value === "string" && THEME_MODES.includes(value);

export const isResolvedThemeMode = (
  value: unknown,
): value is ResolvedThemeMode => value === "light" || value === "dark";

export const getThemeModeOption = (
  mode: ThemeMode,
): ThemeModeOption | undefined =>
  THEME_MODE_OPTIONS.find((option) => option.value === mode);
