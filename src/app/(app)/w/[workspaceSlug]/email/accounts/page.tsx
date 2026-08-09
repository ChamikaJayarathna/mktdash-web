import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Accounts",
};

const EmailAccountsRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Email"
      screen="Accounts"
      description="Connected mailboxes and WhatsApp numbers, their sync health, and which of them your membership is granted to send from."
    />
  );
};

export default EmailAccountsRoute;
