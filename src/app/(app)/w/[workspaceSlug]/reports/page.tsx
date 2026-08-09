import { redirect } from "next/navigation";
import { buildAppModuleHref } from "@/widgets/app-shell";

export interface ReportsRouteProps {
  readonly params: Promise<{ workspaceSlug: string }>;
}

const ReportsRoute = async ({ params }: ReportsRouteProps) => {
  const { workspaceSlug } = await params;

  return redirect(buildAppModuleHref(workspaceSlug, "reports"));
};

export default ReportsRoute;
