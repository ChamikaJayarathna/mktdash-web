"use client";

import Link from "next/link";
import { CircleQuestionMark } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/ui/tooltip";
import { RAIL_UTILITY_ANCHOR_OFFSET } from "../lib/railAnchor";

export interface AppRailHelpLinkProps {
  readonly href: string;
}

const HELP_LABEL = "Help and support";

const AppRailHelpLink = ({ href }: AppRailHelpLinkProps) => {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link
            href={href}
            aria-label={HELP_LABEL}
            className="flex size-7.5 flex-none items-center justify-center rounded-2xl text-on-dark-muted transition-[background-color,color] duration-(--dur-hover) ease-out outline-none hover:bg-on-dark-fill hover:text-on-dark focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-rail"
          >
            <CircleQuestionMark
              className="size-4.5"
              strokeWidth={1.7}
              aria-hidden
            />
          </Link>
        }
      />
      <TooltipContent side="right" sideOffset={RAIL_UTILITY_ANCHOR_OFFSET}>
        {HELP_LABEL}
      </TooltipContent>
    </Tooltip>
  );
};

export default AppRailHelpLink;
