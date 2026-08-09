import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Campaigns",
};

const SequencesCampaignsRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Sequences"
      screen="Campaigns"
      description="Multi-step, cross-channel outbound campaigns — their steps, stop conditions, and sending windows."
    />
  );
};

export default SequencesCampaignsRoute;
