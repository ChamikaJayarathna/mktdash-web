"use client";

import { useEffect, useId, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Info, KeyRound, Mail, Server } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Skeleton } from "@/shared/ui/skeleton";
import {
  connectMailboxSchema,
  passwordRequiredSchema,
  type ConnectMailboxValues,
} from "../schemas/connectMailbox.schema";
import type {
  ConnectMailboxInput,
  EmailProvider,
} from "../types/emailAccount.types";
import PanelSectionHeader from "./PanelSectionHeader";
import ProviderTile from "./ProviderTile";
import ServerSettingsFields from "./ServerSettingsFields";

export interface AddAccountPanelProps {
  readonly providers: readonly EmailProvider[];
  readonly isLoading: boolean;
  readonly isConnecting: boolean;
  readonly onConnect: (input: ConnectMailboxInput) => void;
}

const PROVIDER_SKELETONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

const AddAccountPanel = ({
  providers,
  isLoading,
  isConnecting,
  onConnect,
}: AddAccountPanelProps) => {
  const labelId = useId();
  const addressId = useId();
  const passwordId = useId();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const provider =
    providers.find((candidate) => candidate.id === selectedId) ?? providers[0];
  const isOAuth = provider?.authMethod === "oauth";

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ConnectMailboxValues>({
    resolver: zodResolver(
      isOAuth ? connectMailboxSchema : passwordRequiredSchema,
    ),
    mode: "onTouched",
    defaultValues: { label: "", address: "", appPassword: "" },
  });

  useEffect(() => {
    reset({ label: "", address: "", appPassword: "" });
  }, [provider?.id, reset]);

  const onSubmit = handleSubmit((values) => {
    if (!provider) {
      return;
    }

    onConnect({
      providerId: provider.id,
      label: values.label,
      address: values.address,
      appPassword: isOAuth ? null : values.appPassword,
    });
  });

  return (
    <section
      aria-labelledby="add-account-heading"
      className="flex min-w-0 flex-col gap-2.75"
    >
      <p className="font-mono text-xs font-bold tracking-widest text-accent-500">
        CONNECT NEW
      </p>
      <h2
        id="add-account-heading"
        className="text-3xl leading-tight font-extrabold tracking-tight text-heading"
      >
        Add an account
      </h2>

      <div className="flex flex-col gap-4.5 rounded-5xl border border-border-card bg-card p-4.5 shadow-hairline">
        {isLoading || !provider ? (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(168px,1fr))] gap-row">
            {PROVIDER_SKELETONS.map((index) => (
              <Skeleton key={index} className="h-13.5 rounded-3xl" />
            ))}
          </div>
        ) : (
          <fieldset className="min-w-0">
            <legend className="sr-only">Mail provider</legend>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(168px,1fr))] gap-row">
              {providers.map((candidate) => (
                <ProviderTile
                  key={candidate.id}
                  provider={candidate}
                  isSelected={candidate.id === provider.id}
                  onSelect={(picked) => setSelectedId(picked.id)}
                />
              ))}
            </div>
          </fieldset>
        )}

        {provider ? (
          <form
            noValidate
            onSubmit={onSubmit}
            className="flex flex-col gap-4.5"
          >
            <div className="flex flex-col gap-stack">
              <PanelSectionHeader
                icon={<KeyRound className="size-3.75" strokeWidth={1.9} />}
                title="Account access"
                trailing={
                  <span className="ms-auto flex-none rounded-md bg-surface-6 px-2.25 py-0.75 text-xs font-bold text-text-5">
                    {provider.authLabel}
                  </span>
                }
              />

              <div className="grid grid-cols-1 gap-2.75 sm:grid-cols-2">
                <div className="flex flex-col gap-1.25">
                  <Label htmlFor={labelId}>Label</Label>
                  <Input
                    {...register("label")}
                    id={labelId}
                    placeholder="e.g. Client — Northwind"
                    aria-invalid={errors.label ? true : undefined}
                  />
                  {errors.label ? (
                    <p role="alert" className="text-xs text-danger-600">
                      {errors.label.message}
                    </p>
                  ) : null}
                </div>

                <div className="flex flex-col gap-1.25">
                  <Label htmlFor={addressId}>Email address</Label>
                  <Input
                    {...register("address")}
                    id={addressId}
                    type="email"
                    inputMode="email"
                    autoComplete="off"
                    placeholder="you@company.com"
                    className="font-mono"
                    aria-invalid={errors.address ? true : undefined}
                  />
                  {errors.address ? (
                    <p role="alert" className="text-xs text-danger-600">
                      {errors.address.message}
                    </p>
                  ) : null}
                </div>
              </div>

              {isOAuth ? (
                <div className="flex items-start gap-2.5 rounded-3xl border border-success-100 bg-success-050 px-card py-3">
                  <Check
                    aria-hidden
                    className="mt-px size-3.5 flex-none text-success-600"
                    strokeWidth={2.2}
                  />
                  <p className="text-sm leading-normal font-medium text-success-600">
                    No password needed. {provider.name} authorises through OAuth
                    — you approve scopes on their consent screen and can revoke
                    access at any time. Server settings are filled in for you.
                  </p>
                </div>
              ) : (
                <div>
                  <div className="flex flex-col gap-1.25">
                    <Label htmlFor={passwordId}>App password</Label>
                    <Input
                      {...register("appPassword")}
                      id={passwordId}
                      type="password"
                      autoComplete="off"
                      placeholder="16-character app password"
                      className="font-mono"
                      aria-invalid={errors.appPassword ? true : undefined}
                    />
                    {errors.appPassword ? (
                      <p role="alert" className="text-xs text-danger-600">
                        {errors.appPassword.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="mt-2 flex items-start gap-2.25 rounded-2xl border border-accent-100 bg-accent-025 px-3 py-2.5">
                    <Info
                      aria-hidden
                      className="mt-px size-3.5 flex-none text-accent-500"
                      strokeWidth={2}
                    />
                    <p className="text-xs leading-normal font-medium text-accent-400">
                      Use an app-specific password from {provider.name}&rsquo;s
                      security settings, never your normal login. It is
                      encrypted per tenant and never written to logs.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-stack">
              <PanelSectionHeader
                icon={<Server className="size-3.75" strokeWidth={1.9} />}
                title="Server settings"
                trailing={
                  <span className="ms-auto flex-none text-xs font-medium text-meta">
                    auto-filled for {provider.name}
                  </span>
                }
              />
              <ServerSettingsFields provider={provider} />
            </div>

            <Button
              type="submit"
              variant="solid"
              disabled={isConnecting}
              className="h-11.5 w-full rounded-3xl text-md"
            >
              <Mail className="size-4" aria-hidden />
              {isConnecting ? "Connecting…" : `Connect ${provider.name}`}
            </Button>

            <p className="rounded-3xl border border-dashed border-warning-500 bg-warning-025 px-3 py-2.75 text-xs leading-normal font-medium text-warning-700">
              On connect we check SPF, DKIM and DMARC for the sending domain and
              start a conservative warmup. For cold outreach, use a dedicated
              domain kept separate from your primary one.
            </p>
          </form>
        ) : null}
      </div>
    </section>
  );
};

export default AddAccountPanel;
