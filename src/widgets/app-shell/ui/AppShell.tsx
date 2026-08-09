import type { ReactNode } from "react";
import type { AppRailAccount } from "../model/appModule.types";
import AppRail from "./AppRail";

export interface AppShellProps {
  readonly workspaceSlug: string;
  readonly organisationSlug?: string;
  readonly account?: AppRailAccount;
  readonly children: ReactNode;
}

const AppShell = ({
  workspaceSlug,
  organisationSlug,
  account,
  children,
}: AppShellProps) => {
  return (
    <div className="flex h-dvh overflow-hidden bg-canvas">
      <AppRail
        workspaceSlug={workspaceSlug}
        organisationSlug={organisationSlug}
        account={account}
      />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-card">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
