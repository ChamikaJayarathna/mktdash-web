import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Appearance",
};

const AccountAppearanceRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Account"
      screen="Appearance"
      description="Theme, list density, and how conversations are grouped."
    />
  );
};

export default AccountAppearanceRoute;
