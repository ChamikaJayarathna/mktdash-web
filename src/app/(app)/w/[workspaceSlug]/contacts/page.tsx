import { redirect } from "next/navigation";
import { buildAppModuleHref } from "@/widgets/app-shell";

export interface ContactsRouteProps {
  readonly params: Promise<{ workspaceSlug: string }>;
}

const ContactsRoute = async ({ params }: ContactsRouteProps) => {
  const { workspaceSlug } = await params;

  return redirect(buildAppModuleHref(workspaceSlug, "contacts"));
};

export default ContactsRoute;
