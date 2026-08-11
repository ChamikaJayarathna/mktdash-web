"use client";

import { Plus } from "lucide-react";
import { toast } from "sonner";
import {
  MAX_OPEN_COMPOSERS,
  selectHasCapacity,
  useEmailComposerStore,
} from "@/features/email-composer";
import { Button } from "@/shared/ui/button";

const AT_CAPACITY_MESSAGE = `Close one of your ${MAX_OPEN_COMPOSERS} open messages before starting another.`;

const EmailComposeButton = () => {
  const openComposer = useEmailComposerStore((state) => state.openComposer);
  const hasCapacity = useEmailComposerStore(selectHasCapacity);

  const handleClick = (): void => {
    if (openComposer() === null) {
      toast.error(AT_CAPACITY_MESSAGE);
    }
  };

  return (
    <Button
      size="lg"
      className="mt-0.5 mb-3 w-full flex-none"
      onClick={handleClick}
      title={hasCapacity ? "Compose a new message" : AT_CAPACITY_MESSAGE}
    >
      <Plus aria-hidden />
      Compose
    </Button>
  );
};

export default EmailComposeButton;
