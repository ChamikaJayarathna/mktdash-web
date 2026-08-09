import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Follow-up queue",
};

const EmailFollowUpQueueRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Email · Follow-ups"
      screen="Queue"
      description="Every follow-up waiting to go out, when it is due, and a way to skip, reschedule, or stop it before it sends."
    />
  );
};

export default EmailFollowUpQueueRoute;
