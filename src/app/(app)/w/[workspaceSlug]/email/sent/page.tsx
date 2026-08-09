import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Sent",
};

const EmailSentRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Email"
      screen="Sent"
      description="Everything that has gone out, who sent it, and what happened next — delivered, opened, replied, or bounced."
    />
  );
};

export default EmailSentRoute;
