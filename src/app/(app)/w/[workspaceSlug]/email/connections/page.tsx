import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Connections",
};

const EmailConnectionsRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Email"
      screen="Connections"
      description="Connected mailboxes and WhatsApp numbers, their sync health, and which of them your membership is granted to send from."
    />
  );
};

export default EmailConnectionsRoute;
