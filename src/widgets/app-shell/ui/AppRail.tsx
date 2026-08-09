"use client";

import { usePathname } from "next/navigation";
import { ThemeToggleMenu } from "@/features/theme-switcher";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { RAIL_UTILITY_ANCHOR_OFFSET } from "../lib/railAnchor";
import { workspaceMonogram } from "../lib/workspaceMonogram";
import { buildHelpHref } from "../model/accountMenu";
import type { AppModuleCounts, AppRailAccount } from "../model/appModule.types";
import {
  APP_MODULES,
  buildAppModuleHref,
  resolveActiveAppModuleId,
} from "../model/appModules";
import AppRailHelpLink from "./AppRailHelpLink";
import AppRailItem from "./AppRailItem";
import AppRailProfileMenu from "./AppRailProfileMenu";

export interface AppRailProps {
  readonly workspaceSlug: string;
  readonly workspaceName?: string;
  readonly organisationSlug?: string;
  readonly counts?: AppModuleCounts;
  readonly account?: AppRailAccount;
}

const TOOLTIP_DELAY_MS = 260;

const AppRail = ({
  workspaceSlug,
  workspaceName,
  organisationSlug,
  counts,
  account,
}: AppRailProps) => {
  const pathname = usePathname();
  const activeModuleId = resolveActiveAppModuleId(pathname, workspaceSlug);
  const displayName = workspaceName ?? workspaceSlug;

  return (
    <TooltipProvider delay={TOOLTIP_DELAY_MS}>
      <div className="flex w-rail flex-none flex-col items-center gap-1.5 bg-rail pt-3 pb-3.5">
        <span
          aria-hidden
          className="flex size-control flex-none items-center justify-center rounded-3xl bg-brand-gradient text-base leading-flat font-extrabold text-white shadow-accent"
        >
          {workspaceMonogram(workspaceSlug)}
        </span>
        <span className="sr-only">Current workspace: {displayName}</span>

        <span
          aria-hidden
          className="my-1.5 h-px w-5.5 flex-none bg-on-dark-hairline"
        />

        <nav
          aria-label="Workspace modules"
          className="flex min-h-0 w-full flex-1 justify-center overflow-y-auto"
        >
          <ul className="flex flex-col items-center gap-1.5 pt-0.5">
            {APP_MODULES.map((appModule) => (
              <li key={appModule.id}>
                <AppRailItem
                  href={buildAppModuleHref(workspaceSlug, appModule.id)}
                  label={appModule.label}
                  icon={appModule.icon}
                  isActive={appModule.id === activeModuleId}
                  count={counts?.[appModule.id]}
                />
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-none flex-col items-center gap-row pt-2">
          <ThemeToggleMenu sideOffset={RAIL_UTILITY_ANCHOR_OFFSET} />
          <AppRailHelpLink href={buildHelpHref(workspaceSlug)} />
          {account ? (
            <AppRailProfileMenu
              account={account}
              workspaceSlug={workspaceSlug}
              organisationSlug={organisationSlug}
            />
          ) : null}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AppRail;
