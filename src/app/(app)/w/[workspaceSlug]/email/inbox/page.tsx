import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Inbox",
};

const EmailInboxRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Email"
      screen="Inbox"
      description="The shared inbox across every connected mailbox, with each outgoing touch attributed to the person who sent it."
    />
  );
};

export default EmailInboxRoute;
