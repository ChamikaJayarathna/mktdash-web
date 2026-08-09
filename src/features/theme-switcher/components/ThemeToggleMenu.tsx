"use client";

import { SunMoon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { useThemeMode } from "../hooks/useThemeMode";
import {
  THEME_MODE_OPTIONS,
  getThemeModeOption,
  isThemeMode,
} from "../lib/themeOptions";

const TRIGGER_CLASSNAME =
  "flex size-7.5 flex-none items-center justify-center rounded-2xl text-on-dark-muted transition-[background-color,color] duration-(--dur-hover) ease-out outline-none hover:bg-on-dark-fill hover:text-on-dark focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-rail aria-expanded:bg-on-dark-fill aria-expanded:text-on-dark";

export interface ThemeToggleMenuProps {
  readonly side?: "top" | "right" | "bottom" | "left";
  readonly align?: "start" | "center" | "end";
  readonly sideOffset?: number;
  readonly className?: string;
}

const ThemeToggleMenu = ({
  side = "right",
  align = "end",
  sideOffset = 6,
  className,
}: ThemeToggleMenuProps) => {
  const { mode, resolvedMode, isReady, setMode } = useThemeMode();

  const selectedOption = mode ? getThemeModeOption(mode) : undefined;
  const resolvedOption = resolvedMode
    ? getThemeModeOption(resolvedMode)
    : undefined;
  const TriggerIcon = resolvedOption?.icon ?? SunMoon;

  const handleValueChange = (value: unknown): void => {
    if (isThemeMode(value)) {
      setMode(value);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={
          selectedOption ? `Theme — ${selectedOption.label}` : "Theme"
        }
        aria-busy={!isReady}
        className={cn(TRIGGER_CLASSNAME, className)}
      >
        <TriggerIcon className="size-4.5" strokeWidth={1.7} aria-hidden />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="w-61.5 min-w-0 rounded-4xl border border-border p-3 shadow-popover ring-0"
      >
        <DropdownMenuRadioGroup
          value={mode ?? undefined}
          onValueChange={handleValueChange}
          className="flex flex-col gap-px"
        >
          <DropdownMenuLabel className="px-2.5 pt-0.5 pb-2 type-eyebrow text-eyebrow">
            Theme
          </DropdownMenuLabel>

          {THEME_MODE_OPTIONS.map((option) => (
            <DropdownMenuRadioItem
              key={option.value}
              value={option.value}
              closeOnClick
              className="gap-2.5 rounded-lg py-2 pr-8 pl-2.5 focus:bg-row-hover data-checked:text-accent-500"
            >
              <option.icon
                className="size-4 flex-none text-faint"
                strokeWidth={1.7}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm leading-snug font-bold text-heading">
                  {option.label}
                </span>
                <span className="mt-px block text-xs leading-snug font-normal text-balance text-eyebrow">
                  {option.note}
                </span>
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>

        <p className="mt-2.25 border-t border-border-2 px-2.5 pt-2.25 text-xs leading-snug text-eyebrow">
          Saved on this device, not to your account.
        </p>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggleMenu;
