"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Skeleton } from "@/shared/ui/skeleton";
import { useConnectMailboxWizard } from "../hooks/useConnectMailboxWizard";
import { buildVerificationSteps } from "../lib/scopeLevels";
import type {
  ConnectMailboxInput,
  ConnectVerificationStep,
  EmailProvider,
} from "../types/emailAccount.types";
import ConnectStepAuthorise from "./ConnectStepAuthorise";
import ConnectStepIdentify from "./ConnectStepIdentify";
import ConnectStepVerified from "./ConnectStepVerified";
import ConnectWizardStepper from "./ConnectWizardStepper";

export interface ConnectMailboxDialogProps {
  readonly open: boolean;
  readonly providers: readonly EmailProvider[];
  readonly isLoadingProviders: boolean;
  readonly isConnecting: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onConnect: (
    input: ConnectMailboxInput,
    onVerified: (steps: readonly ConnectVerificationStep[]) => void,
  ) => void;
}

const PROVIDER_SKELETONS = [0, 1, 2, 3, 4, 5];

const ConnectMailboxDialog = ({
  open,
  providers,
  isLoadingProviders,
  isConnecting,
  onOpenChange,
  onConnect,
}: ConnectMailboxDialogProps) => {
  const wizard = useConnectMailboxWizard(providers);
  const [appPassword, setAppPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [appPasswordError, setAppPasswordError] = useState<string | null>(null);
  const [verification, setVerification] = useState<
    readonly ConnectVerificationStep[]
  >([]);

  const provider = wizard.chosenProvider;
  const isOAuth = provider?.authMethod === "oauth";

  const closeAndReset = () => {
    onOpenChange(false);
    wizard.reset();
    setAppPassword("");
    setDisplayName("");
    setAppPasswordError(null);
    setVerification([]);
  };

  const handleAuthorise = () => {
    if (!provider) {
      return;
    }

    if (!isOAuth && appPassword.trim().length === 0) {
      setAppPasswordError(
        "Paste the app-specific password from your provider.",
      );
      return;
    }

    setAppPasswordError(null);

    onConnect(
      {
        providerId: provider.id,
        address: wizard.address,
        label: displayName.trim() || wizard.address,
        appPassword: isOAuth ? null : appPassword,
        scopeId: isOAuth ? wizard.scopeId : null,
      },
      (steps) => {
        setVerification(
          steps.length > 0 ? steps : buildVerificationSteps(wizard.address),
        );
        wizard.goToVerified();
      },
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          closeAndReset();
          return;
        }

        onOpenChange(true);
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100vh-3rem)] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-auth-panel-max"
      >
        <div className="flex flex-none flex-wrap items-center gap-3.5 border-b border-border-2 px-panel py-4">
          <DialogTitle className="flex-none text-lg font-extrabold text-heading">
            Connect a mailbox
          </DialogTitle>
          <DialogDescription className="sr-only">
            Identify the mailbox, authorise Follow Axis with the provider, then
            review the verification checks.
          </DialogDescription>

          <ConnectWizardStepper currentStep={wizard.step} />

          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Close"
            className="flex-none"
            onClick={closeAndReset}
          >
            <X className="size-3.5" aria-hidden />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-gutter">
          {isLoadingProviders ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-11 w-full rounded-3xl" />
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-row">
                {PROVIDER_SKELETONS.map((index) => (
                  <Skeleton key={index} className="h-12.5 rounded-3xl" />
                ))}
              </div>
            </div>
          ) : null}

          {!isLoadingProviders && wizard.step === 1 ? (
            <ConnectStepIdentify
              address={wizard.address}
              providers={providers}
              detection={wizard.detection}
              pickedProviderId={wizard.pickedProviderId}
              onAddressChange={wizard.setAddress}
              onPickProvider={(picked) => wizard.pickProvider(picked.id)}
            />
          ) : null}

          {!isLoadingProviders && wizard.step === 2 && provider ? (
            <ConnectStepAuthorise
              provider={provider}
              address={wizard.address}
              scopeId={wizard.scopeId}
              appPassword={appPassword}
              displayName={displayName}
              appPasswordError={appPasswordError}
              onScopeChange={(level) => wizard.setScopeId(level.id)}
              onAppPasswordChange={(value) => {
                setAppPassword(value);
                setAppPasswordError(null);
              }}
              onDisplayNameChange={setDisplayName}
            />
          ) : null}

          {!isLoadingProviders && wizard.step === 3 ? (
            <ConnectStepVerified
              address={wizard.address}
              steps={verification}
            />
          ) : null}
        </div>

        <div className="flex flex-none items-center gap-2.5 border-t border-border-2 bg-surface-1 px-panel py-3.5">
          {wizard.step === 1 ? (
            <Button
              className="ms-auto h-10 rounded-2xl px-5.5 text-md"
              disabled={!wizard.canContinue}
              onClick={wizard.goToAuthorise}
            >
              Continue
            </Button>
          ) : null}

          {wizard.step === 2 && provider ? (
            <>
              <Button
                variant="outline"
                className="h-10 rounded-2xl px-4"
                onClick={wizard.back}
              >
                Back
              </Button>
              <Button
                variant="solid"
                className="ms-auto h-10 rounded-2xl px-5.5 text-md"
                disabled={isConnecting}
                onClick={handleAuthorise}
              >
                {isConnecting ? "Connecting…" : `Continue to ${provider.name}`}
              </Button>
            </>
          ) : null}

          {wizard.step === 3 ? (
            <Button
              className="ms-auto h-10 rounded-2xl px-5.5 text-md"
              onClick={closeAndReset}
            >
              Done
            </Button>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectMailboxDialog;
