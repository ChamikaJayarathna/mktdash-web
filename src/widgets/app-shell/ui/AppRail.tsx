"use client";

import { usePathname } from "next/navigation";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { workspaceMonogram } from "../lib/workspaceMonogram";
import type { AppModuleCounts, AppRailAccount } from "../model/appModule.types";
import {
  APP_MODULES,
  buildAppModuleHref,
  resolveActiveAppModuleId,
} from "../model/appModules";
import AppRailItem from "./AppRailItem";

export interface AppRailProps {
  readonly workspaceSlug: string;
  readonly workspaceName?: string;
  readonly counts?: AppModuleCounts;
  readonly account?: AppRailAccount;
}

const TOOLTIP_DELAY_MS = 260;

const AppRail = ({
  workspaceSlug,
  workspaceName,
  counts,
  account,
}: AppRailProps) => {
  const pathname = usePathname();
  const activeModuleId = resolveActiveAppModuleId(pathname, workspaceSlug);
  const displayName = workspaceName ?? workspaceSlug;

  return (
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

      <TooltipProvider delay={TOOLTIP_DELAY_MS}>
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
      </TooltipProvider>

      {account ? (
        <span
          title={account.name}
          className="flex size-7.5 flex-none items-center justify-center rounded-full border border-on-dark-hairline bg-ink-500 text-xs leading-flat font-bold text-on-dark"
        >
          <span aria-hidden>{account.initials}</span>
          <span className="sr-only">Signed in as {account.name}</span>
        </span>
      ) : null}
    </div>
  );
};

export default AppRail;
