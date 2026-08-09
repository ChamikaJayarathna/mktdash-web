import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "All contacts",
};

const ContactsAllRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Contacts"
      screen="All contacts"
      description="Every contact in this workspace, with one timeline per person across email and WhatsApp."
    />
  );
};

export default ContactsAllRoute;
