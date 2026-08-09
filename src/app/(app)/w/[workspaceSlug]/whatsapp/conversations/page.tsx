import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Conversations",
};

const WhatsAppConversationsRoute = () => {
  return (
    <ModulePlaceholderPage
      module="WhatsApp"
      screen="Conversations"
      description="Threads on the shared business number, each showing whether the contact's 24-hour session window is still open."
    />
  );
};

export default WhatsAppConversationsRoute;
