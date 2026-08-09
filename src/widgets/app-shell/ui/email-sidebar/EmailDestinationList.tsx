"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";
import { formatSidebarCount } from "../../lib/emailSidebarFormat";
import {
  EMAIL_DESTINATIONS,
  buildEmailDestinationHref,
  resolveActiveEmailDestinationId,
} from "../../model/emailDestinations";
import type { EmailDestinationCounts } from "../../model/emailSidebar.types";

export interface EmailDestinationListProps {
  readonly workspaceSlug: string;
  readonly counts: EmailDestinationCounts;
}

const EmailDestinationList = ({
  workspaceSlug,
  counts,
}: EmailDestinationListProps) => {
  const pathname = usePathname();
  const activeDestinationId = resolveActiveEmailDestinationId(
    pathname,
    workspaceSlug,
  );

  return (
    <ul className="flex flex-none flex-col gap-px">
      {EMAIL_DESTINATIONS.map((destination) => {
        const count = counts[destination.id];
        const hasCount = typeof count === "number" && count > 0;
        const isActive = destination.id === activeDestinationId;

        return (
          <li key={destination.id}>
            <Link
              href={buildEmailDestinationHref(workspaceSlug, destination.id)}
              aria-current={isActive ? "page" : undefined}
              aria-label={
                hasCount
                  ? `${destination.label}, ${count} ${destination.countNoun}`
                  : undefined
              }
              className={cn(
                "flex h-7.75 items-center gap-2 rounded-lg px-2.5 text-base transition-colors duration-(--dur-hover) ease-out outline-none",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-context-panel",
                isActive
                  ? "bg-row-selected font-bold text-heading"
                  : "font-medium text-text-5 hover:bg-surface-6",
              )}
            >
              <span className="min-w-0 flex-1 truncate">
                {destination.label}
              </span>
              {hasCount ? (
                <span
                  aria-hidden
                  className={cn(
                    "flex-none font-mono text-2xs font-semibold",
                    isActive ? "text-heading" : "text-eyebrow",
                  )}
                >
                  {formatSidebarCount(count)}
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default EmailDestinationList;
