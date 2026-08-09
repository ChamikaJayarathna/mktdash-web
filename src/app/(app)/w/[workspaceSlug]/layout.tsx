import type { ReactNode } from "react";
import { AppShell } from "@/widgets/app-shell";

export interface WorkspaceLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ workspaceSlug: string }>;
}

const WorkspaceLayout = async ({ children, params }: WorkspaceLayoutProps) => {
  const { workspaceSlug } = await params;

  return <AppShell workspaceSlug={workspaceSlug}>{children}</AppShell>;
};

export default WorkspaceLayout;
