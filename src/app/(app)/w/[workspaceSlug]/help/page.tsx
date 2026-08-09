import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Help and support",
};

const WorkspaceHelpRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Support"
      screen="Help and support"
      description="Product documentation, the keyboard-shortcut reference, and how to reach the team."
    />
  );
};

export default WorkspaceHelpRoute;
