import type { ReactNode } from "react";
import { EmailSidebar } from "@/widgets/app-shell";

export interface EmailLayoutProps {
  readonly children: ReactNode;
  readonly params: Promise<{ workspaceSlug: string }>;
}

const EmailLayout = async ({ children, params }: EmailLayoutProps) => {
  const { workspaceSlug } = await params;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden md:flex-row">
      <EmailSidebar workspaceSlug={workspaceSlug} />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden bg-card">
        {children}
      </div>
    </div>
  );
};

export default EmailLayout;
