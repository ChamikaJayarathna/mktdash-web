import type { Metadata } from "next";
import { ModulePlaceholderPage } from "@/views/module-placeholder";

export const metadata: Metadata = {
  title: "Channel performance",
};

const ReportsChannelRoute = () => {
  return (
    <ModulePlaceholderPage
      module="Reports"
      screen="Channel performance"
      description="Sent through replied, per channel and per sequence step, over the selected window."
    />
  );
};

export default ReportsChannelRoute;
