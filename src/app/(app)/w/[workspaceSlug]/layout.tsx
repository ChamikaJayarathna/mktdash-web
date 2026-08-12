import type { ReactNode } from "react";
import { AppShell, type AppRailAccount } from "@/widgets/app-shell";
import { ComposerDock } from "@/widgets/composer-dock";

export interface WorkspaceLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ workspaceSlug: string }>;
}

// TODO: Remove these parts after integrating the backend.
const PLACEHOLDER_ACCOUNT: AppRailAccount = {
  name: "Priya Raman",
  email: "priya@followaxis.com",
  initials: "PR",
};

const WorkspaceLayout = async ({ children, params }: WorkspaceLayoutProps) => {
  const { workspaceSlug } = await params;

  return (
    <>
      <AppShell workspaceSlug={workspaceSlug} account={PLACEHOLDER_ACCOUNT}>
        {children}
      </AppShell>

      <ComposerDock
        workspaceSlug={workspaceSlug}
        senderName={PLACEHOLDER_ACCOUNT.name}
      />
    </>
  );
};

export default WorkspaceLayout;
