"use client";

import { useMemo, useState } from "react";
import { detectProvider } from "../lib/detectProvider";
import { RECOMMENDED_SCOPE_ID } from "../lib/scopeLevels";
import type {
  EmailProvider,
  EmailProviderId,
  MailboxScopeId,
  ProviderDetection,
} from "../types/emailAccount.types";

export type ConnectWizardStep = 1 | 2 | 3;

export interface ConnectMailboxWizardState {
  readonly step: ConnectWizardStep;
  readonly address: string;
  readonly pickedProviderId: EmailProviderId | null;
  readonly scopeId: MailboxScopeId;
  readonly detection: ProviderDetection | null;
  readonly chosenProvider: EmailProvider | null;
  readonly canContinue: boolean;
  readonly setAddress: (address: string) => void;
  readonly pickProvider: (providerId: EmailProviderId) => void;
  readonly setScopeId: (scopeId: MailboxScopeId) => void;
  readonly goToAuthorise: () => void;
  readonly goToVerified: () => void;
  readonly back: () => void;
  readonly reset: () => void;
}

export const useConnectMailboxWizard = (
  providers: readonly EmailProvider[],
): ConnectMailboxWizardState => {
  const [step, setStep] = useState<ConnectWizardStep>(1);
  const [address, setAddressState] = useState("");
  const [pickedProviderId, setPickedProviderId] =
    useState<EmailProviderId | null>(null);
  const [scopeId, setScopeId] = useState<MailboxScopeId>(RECOMMENDED_SCOPE_ID);

  const detection = useMemo<ProviderDetection | null>(() => {
    if (pickedProviderId) {
      const provider = providers.find(
        (candidate) => candidate.id === pickedProviderId,
      );

      return provider
        ? { provider, how: "Chosen manually", confidence: "manual" }
        : null;
    }

    return detectProvider(address, providers);
  }, [address, pickedProviderId, providers]);

  const chosenProvider = detection?.provider ?? null;

  const setAddress = (next: string) => {
    setAddressState(next);
    setPickedProviderId(null);
  };

  const pickProvider = (providerId: EmailProviderId) => {
    setPickedProviderId(providerId);
  };

  const reset = () => {
    setStep(1);
    setAddressState("");
    setPickedProviderId(null);
    setScopeId(RECOMMENDED_SCOPE_ID);
  };

  return {
    step,
    address,
    pickedProviderId,
    scopeId,
    detection,
    chosenProvider,
    canContinue: chosenProvider !== null,
    setAddress,
    pickProvider,
    setScopeId,
    goToAuthorise: () => {
      if (chosenProvider) {
        setPickedProviderId(chosenProvider.id);
        setStep(2);
      }
    },
    goToVerified: () => setStep(3),
    back: () =>
      setStep((current) =>
        current > 1 ? ((current - 1) as ConnectWizardStep) : current,
      ),
    reset,
  };
};
