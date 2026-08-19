"use client";

import { useId } from "react";
import { Check } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { providerToneClasses } from "../lib/emailAccountFormat";
import { MAILBOX_SCOPE_LEVELS, scopeStringFor } from "../lib/scopeLevels";
import type {
  EmailProvider,
  MailboxScopeId,
  MailboxScopeLevel,
} from "../types/emailAccount.types";
import ScopeLevelCard from "./ScopeLevelCard";
import ServerSettingsFields from "./ServerSettingsFields";

export interface ConnectStepAuthoriseProps {
  readonly provider: EmailProvider;
  readonly address: string;
  readonly scopeId: MailboxScopeId;
  readonly appPassword: string;
  readonly displayName: string;
  readonly appPasswordError: string | null;
  readonly onScopeChange: (level: MailboxScopeLevel) => void;
  readonly onAppPasswordChange: (value: string) => void;
  readonly onDisplayNameChange: (value: string) => void;
}

const ConnectStepAuthorise = ({
  provider,
  address,
  scopeId,
  appPassword,
  displayName,
  appPasswordError,
  onScopeChange,
  onAppPasswordChange,
  onDisplayNameChange,
}: ConnectStepAuthoriseProps) => {
  const passwordId = useId();
  const displayNameId = useId();
  const passwordErrorId = `${passwordId}-error`;
  const isOAuth = provider.authMethod === "oauth";

  return (
    <div>
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className={cn(
            "grid size-9.5 flex-none place-items-center rounded-3xl text-lg font-extrabold",
            providerToneClasses[provider.tone],
          )}
        >
          {provider.monogram}
        </span>
        <div className="min-w-0">
          <h3 className="text-xl leading-tight font-extrabold tracking-snug text-heading">
            Authorise {provider.name}
          </h3>
          <p className="mt-0.75 truncate font-mono text-base font-medium text-meta">
            {address}
          </p>
        </div>
      </div>

      {isOAuth ? (
        <>
          <div className="mt-4 flex items-start gap-2.75 rounded-4xl border border-success-100 bg-success-050 px-3.75 py-3.5">
            <Check
              aria-hidden
              className="mt-px size-3.5 flex-none text-success-600"
              strokeWidth={2.4}
            />
            <p className="text-sm leading-normal font-medium text-success-600">
              You will sign in on{" "}
              <span className="font-mono font-semibold">
                {provider.consentHost}
              </span>
              , not here. Your password, two-factor code and any security checks
              stay with {provider.name} — we receive a revocable token and
              nothing else. Server settings are filled in for you.
            </p>
          </div>

          <fieldset className="mt-5 min-w-0">
            <legend className="text-lg font-extrabold text-heading">
              What should Follow Axis be allowed to do?
            </legend>
            <p className="mt-1.25 text-sm leading-normal font-medium text-text-6">
              Ask for the least you need. You can widen this later without
              disconnecting — the provider will simply ask you to approve the
              extra permission in context.
            </p>

            <div className="mt-3.25 flex flex-col gap-row">
              {MAILBOX_SCOPE_LEVELS.map((level) => (
                <ScopeLevelCard
                  key={level.id}
                  level={level}
                  scopeString={scopeStringFor(level, provider)}
                  isSelected={level.id === scopeId}
                  isRecommended={level.id === "reply"}
                  onSelect={onScopeChange}
                />
              ))}
            </div>
          </fieldset>
        </>
      ) : (
        <>
          <p className="mt-4 rounded-4xl border border-warning-500 bg-warning-025 px-3.75 py-3.25 text-sm leading-normal font-medium text-warning-700">
            {provider.name} has no OAuth for third-party mail clients, so this
            route uses an{" "}
            <strong className="font-bold">app-specific password</strong>{" "}
            generated in your provider&rsquo;s security settings — never your
            normal login. It is encrypted per tenant and never written to logs.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={passwordId}>App password</Label>
              <Input
                id={passwordId}
                type="password"
                autoComplete="off"
                value={appPassword}
                onChange={(event) => onAppPasswordChange(event.target.value)}
                placeholder="16-character password"
                className="h-10 rounded-2xl font-mono"
                aria-invalid={appPasswordError ? true : undefined}
                aria-describedby={
                  appPasswordError ? passwordErrorId : undefined
                }
              />
              {appPasswordError ? (
                <p
                  id={passwordErrorId}
                  role="alert"
                  className="text-xs text-danger-600"
                >
                  {appPasswordError}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor={displayNameId}>Display name</Label>
              <Input
                id={displayNameId}
                value={displayName}
                onChange={(event) => onDisplayNameChange(event.target.value)}
                placeholder="e.g. Client — Northwind"
                className="h-10 rounded-2xl"
              />
            </div>
          </div>

          <div className="mt-4.5 flex items-center gap-2.5 border-b border-border-2 pb-2.5">
            <h4 className="type-h2 text-heading">Server settings</h4>
            <span className="ms-auto text-xs font-medium text-eyebrow">
              auto-filled for {provider.name}
            </span>
          </div>

          <div className="mt-3">
            <ServerSettingsFields provider={provider} />
          </div>
        </>
      )}
    </div>
  );
};

export default ConnectStepAuthorise;
