import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Users",
};

const AdminUsersRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Admin"
      screen="Users"
      description="Members of this workspace, the role on each membership, and the mailboxes and numbers it is granted to send from."
    />
  );
};

export default AdminUsersRoute;
