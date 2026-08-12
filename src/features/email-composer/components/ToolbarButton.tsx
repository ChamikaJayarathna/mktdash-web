"use client";

import type { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

export interface ToolbarButtonProps {
  readonly label: string;
  readonly shortcut?: string;
  readonly isActive?: boolean;
  readonly isDisabled?: boolean;
  readonly hasPopup?: boolean;
  readonly isExpanded?: boolean;
  readonly className?: string;
  readonly onClick?: () => void;
  readonly children: ReactNode;
}

const ToolbarButton = ({
  label,
  shortcut,
  isActive = false,
  isDisabled = false,
  hasPopup = false,
  isExpanded,
  className,
  onClick,
  children,
}: ToolbarButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            disabled={isDisabled}
            onClick={onClick}
            aria-label={label}
            aria-pressed={hasPopup ? undefined : isActive}
            aria-haspopup={hasPopup ? "menu" : undefined}
            aria-expanded={isExpanded}
            className={cn(
              "inline-flex h-control-sm flex-none items-center justify-center gap-1 rounded-lg px-1.75 text-text-5 transition-colors duration-(--dur-hover) ease-out outline-none",
              "hover:bg-surface-5 hover:text-text-3",
              "focus-visible:ring-2 focus-visible:ring-ring/50",
              "disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:bg-transparent",
              isActive && "bg-accent-075 text-accent-700",
              className,
            )}
          />
        }
      >
        {children}
      </TooltipTrigger>

      <TooltipContent>
        {label}
        {shortcut ? (
          <span className="font-mono text-2xs opacity-70">{shortcut}</span>
        ) : null}
      </TooltipContent>
    </Tooltip>
  );
};

export default ToolbarButton;
