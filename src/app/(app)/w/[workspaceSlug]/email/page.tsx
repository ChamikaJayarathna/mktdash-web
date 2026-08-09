import { redirect } from "next/navigation";
import { buildAppModuleHref } from "@/widgets/app-shell";

export interface EmailRouteProps {
  readonly params: Promise<{ workspaceSlug: string }>;
}

const EmailRoute = async ({ params }: EmailRouteProps) => {
  const { workspaceSlug } = await params;

  return redirect(buildAppModuleHref(workspaceSlug, "email"));
};

export default EmailRoute;
