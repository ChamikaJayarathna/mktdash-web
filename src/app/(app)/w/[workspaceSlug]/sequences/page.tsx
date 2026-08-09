import { redirect } from "next/navigation";
import { buildAppModuleHref } from "@/widgets/app-shell";

export interface SequencesRouteProps {
  readonly params: Promise<{ workspaceSlug: string }>;
}

const SequencesRoute = async ({ params }: SequencesRouteProps) => {
  const { workspaceSlug } = await params;

  return redirect(buildAppModuleHref(workspaceSlug, "sequences"));
};

export default SequencesRoute;
