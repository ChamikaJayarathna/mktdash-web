import type { ReactNode } from "react";
import AppRail from "./AppRail";

export interface AppShellProps {
  readonly workspaceSlug: string;
  readonly children: ReactNode;
}

const AppShell = ({ workspaceSlug, children }: AppShellProps) => {
  return (
    <div className="flex h-dvh overflow-hidden bg-canvas">
      <AppRail workspaceSlug={workspaceSlug} />
      <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-card">
        {children}
      </main>
    </div>
  );
};

export default AppShell;
