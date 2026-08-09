import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Drafts",
};

const EmailDraftsRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Email"
      screen="Drafts"
      description="Messages saved but not yet sent, from every mailbox you are granted, with the person who wrote each one."
    />
  );
};

export default EmailDraftsRoute;
