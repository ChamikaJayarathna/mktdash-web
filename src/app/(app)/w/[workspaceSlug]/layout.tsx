import type { ReactNode } from "react";
import { AppShell, type AppRailAccount } from "@/widgets/app-shell";

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
    <AppShell workspaceSlug={workspaceSlug} account={PLACEHOLDER_ACCOUNT}>
      {children}
    </AppShell>
  );
};

export default WorkspaceLayout;
