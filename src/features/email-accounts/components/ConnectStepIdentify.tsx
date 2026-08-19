"use client";

import { useId } from "react";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { providerToneClasses } from "../lib/emailAccountFormat";
import type {
  EmailProvider,
  ProviderDetection,
} from "../types/emailAccount.types";
import ProviderTile from "./ProviderTile";

export interface ConnectStepIdentifyProps {
  readonly address: string;
  readonly providers: readonly EmailProvider[];
  readonly detection: ProviderDetection | null;
  readonly pickedProviderId: string | null;
  readonly onAddressChange: (address: string) => void;
  readonly onPickProvider: (provider: EmailProvider) => void;
}

const ConnectStepIdentify = ({
  address,
  providers,
  detection,
  pickedProviderId,
  onAddressChange,
  onPickProvider,
}: ConnectStepIdentifyProps) => {
  const addressId = useId();
  const isLowConfidence = detection?.confidence === "low";

  return (
    <div>
      <h3 className="text-xl leading-tight font-extrabold tracking-snug text-heading">
        Which mailbox?
      </h3>
      <p className="mt-1.5 text-base leading-normal font-medium text-text-6">
        Type the address and we will work out who hosts it. You can override the
        result if we guess wrong.
      </p>

      <div className="mt-4">
        <Label htmlFor={addressId}>Email address</Label>
        <Input
          id={addressId}
          type="email"
          inputMode="email"
          autoComplete="off"
          autoFocus
          value={address}
          onChange={(event) => onAddressChange(event.target.value)}
          placeholder="priya@followaxis.com"
          className="mt-1.5 h-11 rounded-3xl font-mono text-md"
        />
      </div>

      {detection ? (
        <div
          className={cn(
            "mt-3.5 flex animate-fa-in items-start gap-3 rounded-4xl border px-3.75 py-3.5",
            isLowConfidence
              ? "border-warning-500 bg-warning-025"
              : "border-accent-150 bg-accent-025",
          )}
        >
          <span
            aria-hidden
            className={cn(
              "grid size-9.5 flex-none place-items-center rounded-3xl text-md font-extrabold",
              providerToneClasses[detection.provider.tone],
            )}
          >
            {detection.provider.monogram}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-md font-extrabold text-heading">
              {detection.provider.name}
            </p>
            <p className="mt-1 text-sm leading-normal font-medium text-text-5">
              {detection.how}
            </p>
            {isLowConfidence ? (
              <p className="mt-1.75 text-sm leading-normal font-semibold text-warning-700">
                We could not identify this host, so we will fall back to manual
                IMAP and SMTP. Pick a provider below if you know it — a mail
                record is a hint, not proof.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}

      <fieldset className="mt-4.5 min-w-0">
        <legend className="type-eyebrow text-eyebrow">
          Or choose the provider yourself
        </legend>
        <div className="mt-2.5 grid grid-cols-[repeat(auto-fill,minmax(232px,1fr))] gap-row">
          {providers.map((provider) => (
            <ProviderTile
              key={provider.id}
              provider={provider}
              isSelected={
                pickedProviderId
                  ? pickedProviderId === provider.id
                  : detection?.provider.id === provider.id
              }
              onSelect={onPickProvider}
            />
          ))}
        </div>
      </fieldset>
    </div>
  );
};

export default ConnectStepIdentify;
