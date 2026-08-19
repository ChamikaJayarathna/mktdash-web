"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { useConnectMailbox } from "../hooks/useConnectMailbox";
import { useEmailProviders } from "../hooks/useEmailProviders";
import type {
  ConnectMailboxInput,
  ConnectVerificationStep,
} from "../types/emailAccount.types";
import ConnectMailboxDialog from "./ConnectMailboxDialog";

export interface ConnectMailboxLauncherProps {
  readonly workspaceSlug: string;
}

const ConnectMailboxLauncher = ({
  workspaceSlug,
}: ConnectMailboxLauncherProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const providersQuery = useEmailProviders(workspaceSlug);
  const connectMutation = useConnectMailbox(workspaceSlug);

  const handleConnect = (
    input: ConnectMailboxInput,
    onVerified: (steps: readonly ConnectVerificationStep[]) => void,
  ) => {
    connectMutation.mutate(input, {
      onSuccess: (outcome) => {
        onVerified(outcome.verification);
      },
      onError: () => {
        toast.error(`${input.address} could not be connected`, {
          description: "Nothing was saved — check the details and try again.",
        });
      },
    });
  };

  return (
    <>
      <Button
        className="h-10 flex-none rounded-3xl px-4.5 text-md"
        onClick={() => setIsOpen(true)}
      >
        <Plus className="size-3.75" aria-hidden strokeWidth={2.4} />
        Connect a mailbox
      </Button>

      <ConnectMailboxDialog
        open={isOpen}
        providers={providersQuery.data ?? []}
        isLoadingProviders={providersQuery.isPending}
        isConnecting={connectMutation.isPending}
        onOpenChange={setIsOpen}
        onConnect={handleConnect}
      />
    </>
  );
};

export default ConnectMailboxLauncher;
