import { redirect } from "next/navigation";
import { buildAppModuleHref } from "@/widgets/app-shell";

export interface WhatsAppRouteProps {
  readonly params: Promise<{ workspaceSlug: string }>;
}

const WhatsAppRoute = async ({ params }: WhatsAppRouteProps) => {
  const { workspaceSlug } = await params;

  return redirect(buildAppModuleHref(workspaceSlug, "whatsapp"));
};

export default WhatsAppRoute;
