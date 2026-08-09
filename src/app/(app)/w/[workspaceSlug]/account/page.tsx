import { redirect } from "next/navigation";
import { buildWorkspaceHref } from "@/widgets/app-shell";

export interface AccountRouteProps {
  readonly params: Promise<{ workspaceSlug: string }>;
}

const AccountRoute = async ({ params }: AccountRouteProps) => {
  const { workspaceSlug } = await params;

  return redirect(`${buildWorkspaceHref(workspaceSlug)}/account/profile`);
};

export default AccountRoute;
