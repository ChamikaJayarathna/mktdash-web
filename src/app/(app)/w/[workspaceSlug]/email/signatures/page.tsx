import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Signatures",
};

const EmailSignaturesRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Email"
      screen="Signatures"
      description="Per-user and per-mailbox sign-offs, so every send carries the right name without anyone pasting it by hand."
    />
  );
};

export default EmailSignaturesRoute;
