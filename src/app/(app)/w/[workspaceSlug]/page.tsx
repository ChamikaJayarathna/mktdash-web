import { redirect } from "next/navigation";
import { buildAppModuleHref } from "@/widgets/app-shell";

export interface WorkspaceRouteProps {
  readonly params: Promise<{ workspaceSlug: string }>;
}

const WorkspaceRoute = async ({ params }: WorkspaceRouteProps) => {
  const { workspaceSlug } = await params;

  return redirect(buildAppModuleHref(workspaceSlug, "home"));
};

export default WorkspaceRoute;
