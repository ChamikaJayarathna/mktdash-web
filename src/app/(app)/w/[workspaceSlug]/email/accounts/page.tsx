import type { Metadata } from "next";
import { EmailAccountsPage } from "@/views/email-accounts";

export const metadata: Metadata = {
  title: "Email connections",
};

export interface EmailAccountsRouteProps {
  readonly params: Promise<{ workspaceSlug: string }>;
}

const EmailAccountsRoute = async ({ params }: EmailAccountsRouteProps) => {
  const { workspaceSlug } = await params;

  return <EmailAccountsPage workspaceSlug={workspaceSlug} />;
};

export default EmailAccountsRoute;
