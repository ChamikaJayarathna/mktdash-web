import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Home",
};

const WorkspaceHomeRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Home"
      screen="Today"
      description="The daily standing start — what goes out today, which threads need a human, and where sending is paused."
    />
  );
};

export default WorkspaceHomeRoute;
