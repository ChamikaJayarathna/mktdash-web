"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { RAIL_UTILITY_ANCHOR_OFFSET } from "../lib/railAnchor";
import { ACCOUNT_MENU_ITEMS, buildAccountMenuHref } from "../model/accountMenu";
import type { AppRailAccount } from "../model/appModule.types";

export interface AppRailProfileMenuProps {
  readonly account: AppRailAccount;
  readonly workspaceSlug: string;
  readonly organisationSlug?: string;
}

const AppRailProfileMenu = ({
  account,
  workspaceSlug,
  organisationSlug,
}: AppRailProfileMenuProps) => {
  const items = ACCOUNT_MENU_ITEMS.map((item) => ({
    item,
    href: buildAccountMenuHref(item, { workspaceSlug, organisationSlug }),
  })).filter(
    (
      entry,
    ): entry is { item: (typeof ACCOUNT_MENU_ITEMS)[number]; href: string } =>
      entry.href !== null,
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`Account and settings — ${account.name}`}
        className="flex size-7.5 flex-none items-center justify-center rounded-full border-[1.5px] border-on-dark-hairline-strong bg-ink-500 text-xs leading-flat font-bold text-on-dark transition-[border-color] duration-(--dur-hover) ease-out outline-none hover:border-accent-500 focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 focus-visible:ring-offset-rail aria-expanded:border-accent-500"
      >
        <span aria-hidden>{account.initials}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="right"
        align="end"
        sideOffset={RAIL_UTILITY_ANCHOR_OFFSET}
        className="w-61.5 min-w-0 rounded-4xl border border-border p-3 shadow-popover ring-0"
      >
        <div className="flex items-center gap-2.5 border-b border-border-2 pb-2.75">
          <span
            aria-hidden
            className="flex size-9 flex-none items-center justify-center rounded-full bg-ink-500 text-base leading-flat font-bold text-on-dark"
          >
            {account.initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-base leading-snug font-bold text-heading">
              {account.name}
            </p>
            <p className="truncate font-mono text-xs font-medium text-meta">
              {account.email}
            </p>
          </div>
        </div>

        <div className="-mx-1 mt-2.25 flex flex-col gap-px px-1">
          {items.map(({ item, href }) => (
            <DropdownMenuItem
              key={item.id}
              className="gap-2.5 rounded-lg px-2.5 py-2 focus:bg-row-hover"
              render={<Link href={href} />}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm leading-snug font-bold text-heading">
                  {item.label}
                </span>
                <span className="mt-px block truncate text-xs leading-snug font-normal text-eyebrow">
                  {item.note}
                </span>
              </span>
              <ChevronRight
                aria-hidden
                className="size-3.5 flex-none text-faint"
              />
            </DropdownMenuItem>
          ))}
        </div>

        <div className="mt-2.25 border-t border-border-2 pt-2.25">
          <DropdownMenuItem
            variant="destructive"
            disabled
            className="rounded-lg px-2.5 py-2 text-sm font-bold"
          >
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate">Sign out</span>
              <span className="mt-px block truncate text-xs leading-snug font-normal text-eyebrow">
                Available once authentication is wired
              </span>
            </span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AppRailProfileMenu;
