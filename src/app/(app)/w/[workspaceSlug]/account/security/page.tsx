import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Security",
};

const AccountSecurityRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Account"
      screen="Security"
      description="Multi-factor authentication and the sessions currently signed in as you."
    />
  );
};

export default AccountSecurityRoute;
