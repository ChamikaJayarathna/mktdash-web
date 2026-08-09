import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Templates",
};

const EmailTemplatesRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Email"
      screen="Templates"
      description="Reusable content across the three save scopes — private, workspace, and global — with promotion always audited."
    />
  );
};

export default EmailTemplatesRoute;
