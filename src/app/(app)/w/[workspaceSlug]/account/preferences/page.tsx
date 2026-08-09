import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Preferences",
};

const AccountPreferencesRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Account"
      screen="Preferences"
      description="Language, timezone, and the mailbox new messages default to. Scheduled sends always show an explicit timezone."
    />
  );
};

export default AccountPreferencesRoute;
