import { redirect } from "next/navigation";
import { buildAppModuleHref } from "@/widgets/app-shell";

export interface AdminRouteProps {
  readonly params: Promise<{ workspaceSlug: string }>;
}

const AdminRoute = async ({ params }: AdminRouteProps) => {
  const { workspaceSlug } = await params;

  return redirect(buildAppModuleHref(workspaceSlug, "admin"));
};

export default AdminRoute;
