"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";

export interface AppRailItemProps {
  readonly href: string;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly isActive: boolean;
  readonly count?: number;
}

const COUNT_CEILING = 99;

const AppRailItem = ({
  href,
  label,
  icon: Icon,
  isActive,
  count,
}: AppRailItemProps) => {
  const hasCount = typeof count === "number" && count > 0;
  const countLabel = !hasCount
    ? null
    : count > COUNT_CEILING
      ? `${COUNT_CEILING}+`
      : `${count}`;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={href}
            aria-label={hasCount ? `${label}, ${count} waiting` : label}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "relative flex size-9.5 items-center justify-center rounded-3xl transition-[background-color,color,box-shadow] duration-(--dur-hover) ease-out outline-none",
              "focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-rail",
              isActive
                ? "bg-accent-500 text-white shadow-accent"
                : "text-on-dark-body hover:bg-on-dark-fill hover:text-on-dark",
            )}
          >
            <Icon className="size-5" strokeWidth={1.7} aria-hidden />
            {countLabel ? (
              <span
                aria-hidden
                className="absolute -top-0.5 -right-0.75 flex h-4.25 min-w-4.25 items-center justify-center rounded-2xl border-2 border-rail bg-accent-500 px-1 font-mono text-2xs leading-flat font-semibold text-white"
              >
                {countLabel}
              </span>
            ) : null}
          </Link>
        }
      />
      <TooltipContent side="right" sideOffset={10}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
};

export default AppRailItem;
