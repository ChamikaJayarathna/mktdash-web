import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Notifications",
};

const AccountNotificationsRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Account"
      screen="Notifications"
      description="What reaches you by email and desktop, and when the digest is sent."
    />
  );
};

export default AccountNotificationsRoute;
