import { cn } from "@/shared/lib/utils";
import type { EmailDestinationCounts } from "../../model/emailSidebar.types";
import EmailComposeButton from "./EmailComposeButton";
import EmailDestinationList from "./EmailDestinationList";

export interface EmailSidebarProps {
  readonly workspaceSlug: string;
  readonly counts?: EmailDestinationCounts;
  readonly className?: string;
}

const NO_COUNTS: EmailDestinationCounts = {};

const EmailSidebar = ({
  workspaceSlug,
  counts = NO_COUNTS,
  className,
}: EmailSidebarProps) => {
  return (
    <nav
      aria-label="Email"
      className={cn(
        "flex max-h-72 w-full flex-none flex-col overflow-y-auto border-b border-border-4 bg-context-panel px-3 pt-3.75 pb-3",
        "md:max-h-none md:w-context-panel md:overflow-hidden md:border-r md:border-b-0",
        className,
      )}
    >
      <h2 className="flex-none px-0.75 pb-3 text-lg font-extrabold text-heading">
        Email
      </h2>

      <EmailComposeButton />

      <EmailDestinationList workspaceSlug={workspaceSlug} counts={counts} />
    </nav>
  );
};

export default EmailSidebar;
