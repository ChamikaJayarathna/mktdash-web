"use client";

import { Plus } from "lucide-react";
import { Button } from "@/shared/ui/button";

const UNAVAILABLE_REASON = "Available once the composer is built";

const EmailComposeButton = () => {
  return (
    <Button
      size="lg"
      className="mt-0.5 mb-3 w-full flex-none"
      disabled
      title={UNAVAILABLE_REASON}
    >
      <Plus aria-hidden />
      Compose
    </Button>
  );
};

export default EmailComposeButton;
