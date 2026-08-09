import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "My profile",
};

const AccountProfileRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Account"
      screen="My profile"
      description="Your name, photo, and personal signature — the identity every send you make is attributed to."
    />
  );
};

export default AccountProfileRoute;
