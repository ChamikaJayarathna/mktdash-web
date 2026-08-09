import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "API keys",
};

const AccountApiKeysRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Account"
      screen="API keys"
      description="Personal access keys, their scopes, and when each was last used."
    />
  );
};

export default AccountApiKeysRoute;
