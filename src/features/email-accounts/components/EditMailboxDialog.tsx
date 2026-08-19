"use client";

import { useId, useState, type ReactNode } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { providerToneClasses } from "../lib/emailAccountFormat";
import { MAILBOX_SCOPE_LEVELS, scopeStringFor } from "../lib/scopeLevels";
import { sortWeekdays } from "../lib/sendingWindow";
import {
  editMailboxSchema,
  type EditMailboxValues,
} from "../schemas/editMailbox.schema";
import type {
  EmailProvider,
  Mailbox,
  MailboxScopeId,
  MailboxGrant,
  UpdateMailboxInput,
  Weekday,
  WorkspaceMember,
} from "../types/emailAccount.types";
import MailboxGrantList from "./MailboxGrantList";
import ScopeLevelCard from "./ScopeLevelCard";
import SendingWindowFields from "./SendingWindowFields";
import ServerSettingsFields from "./ServerSettingsFields";

export interface EditMailboxDialogProps {
  readonly mailbox: Mailbox | null;
  readonly provider: EmailProvider | null;
  readonly members: readonly WorkspaceMember[];
  readonly isLoadingMembers: boolean;
  readonly isSaving: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSave: (input: UpdateMailboxInput) => void;
}

const Section = ({
  title,
  hint,
  children,
}: {
  readonly title: string;
  readonly hint: string;
  readonly children: ReactNode;
}) => (
  <section className="flex flex-col gap-2.5 rounded-4xl border border-border-2 bg-card p-card">
    <div>
      <h3 className="type-h2 text-heading">{title}</h3>
      <p className="mt-0.75 text-sm leading-normal font-medium text-text-6">
        {hint}
      </p>
    </div>
    {children}
  </section>
);

interface EditMailboxFormProps {
  readonly mailbox: Mailbox;
  readonly provider: EmailProvider | null;
  readonly members: readonly WorkspaceMember[];
  readonly isLoadingMembers: boolean;
  readonly isSaving: boolean;
  readonly onCancel: () => void;
  readonly onSave: (input: UpdateMailboxInput) => void;
}

const EditMailboxForm = ({
  mailbox,
  provider,
  members,
  isLoadingMembers,
  isSaving,
  onCancel,
  onSave,
}: EditMailboxFormProps) => {
  const displayNameId = useId();
  const dailyCapId = useId();
  const appPasswordId = useId();

  const [days, setDays] = useState<readonly Weekday[]>(
    mailbox.sendingWindow.days,
  );
  const [scopeId, setScopeId] = useState<MailboxScopeId | null>(
    mailbox.scopeId,
  );
  const [grants, setGrants] = useState<readonly MailboxGrant[]>(mailbox.grants);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    setValue,
  } = useForm<EditMailboxValues>({
    resolver: zodResolver(editMailboxSchema),
    mode: "onTouched",
    defaultValues: {
      displayName: mailbox.displayName,
      dailyCap: mailbox.dailyCap,
      days: [...mailbox.sendingWindow.days],
      startTime: mailbox.sendingWindow.startTime,
      endTime: mailbox.sendingWindow.endTime,
      timeZone: mailbox.sendingWindow.timeZone,
      appPassword: "",
    },
  });

  const isOAuth = mailbox.authMethod === "oauth";
  const timeZone = useWatch({ control, name: "timeZone" });
  const startTime = useWatch({ control, name: "startTime" });
  const endTime = useWatch({ control, name: "endTime" });

  const toggleDay = (day: Weekday) => {
    const next = days.includes(day)
      ? days.filter((candidate) => candidate !== day)
      : sortWeekdays([...days, day]);

    setDays(next);
    setValue("days", [...next], { shouldValidate: true });
  };

  const onSubmit = handleSubmit((values) => {
    onSave({
      mailboxId: mailbox.id,
      displayName: values.displayName.trim(),
      dailyCap: values.dailyCap,
      sendingWindow: {
        days: sortWeekdays(values.days),
        startTime: values.startTime,
        endTime: values.endTime,
        timeZone: values.timeZone,
      },
      scopeId: isOAuth ? scopeId : null,
      grants,
      appPassword: values.appPassword.trim() || null,
      expectedUpdatedAt: mailbox.updatedAt,
    });
  });

  return (
    <form
      noValidate
      onSubmit={onSubmit}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="grid min-h-0 flex-1 grid-cols-1 items-start gap-stack overflow-y-auto p-gutter lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-stack">
          <Section
            title="Mailbox"
            hint="The address itself cannot change — reconnect the mailbox to move to a different one."
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={displayNameId}>Display name</Label>
                <Input
                  {...register("displayName")}
                  id={displayNameId}
                  aria-invalid={errors.displayName ? true : undefined}
                />
                {errors.displayName ? (
                  <p role="alert" className="text-xs text-danger-600">
                    {errors.displayName.message}
                  </p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label>Connected through</Label>
                <p className="flex h-control items-center rounded-xl border border-border-5 bg-surface-3 px-2.75 text-base font-medium text-meta">
                  {mailbox.providerLabel}
                </p>
              </div>
            </div>
          </Section>

          <Section
            title="Sending limits"
            hint="Follow Axis never sends outside this window, and stops for the day once the cap is reached."
          >
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={dailyCapId}>Daily send cap</Label>
              <div className="flex flex-wrap items-center gap-2.5">
                <Input
                  {...register("dailyCap", { valueAsNumber: true })}
                  id={dailyCapId}
                  type="number"
                  inputMode="numeric"
                  min={1}
                  className="w-28 font-mono"
                  aria-invalid={errors.dailyCap ? true : undefined}
                />
                <span className="font-mono text-xs font-medium text-eyebrow">
                  {mailbox.sentToday} sent today
                </span>
              </div>
              {errors.dailyCap ? (
                <p role="alert" className="text-xs text-danger-600">
                  {errors.dailyCap.message}
                </p>
              ) : null}
            </div>

            <SendingWindowFields
              days={days}
              startTime={startTime}
              endTime={endTime}
              timeZone={timeZone}
              daysError={errors.days?.message ?? null}
              endTimeError={errors.endTime?.message ?? null}
              onToggleDay={toggleDay}
              onStartTimeChange={(value) =>
                setValue("startTime", value, { shouldValidate: true })
              }
              onEndTimeChange={(value) =>
                setValue("endTime", value, { shouldValidate: true })
              }
              onTimeZoneChange={(value) =>
                setValue("timeZone", value, { shouldValidate: true })
              }
            />
          </Section>

          <Section
            title="Who can send"
            hint="Sending access is granted per member, on top of whatever their role already allows."
          >
            <MailboxGrantList
              grants={grants}
              members={members}
              isLoadingMembers={isLoadingMembers}
              address={mailbox.address}
              onToggleSend={(membershipId, canSend) =>
                setGrants((current) =>
                  current.map((grant) =>
                    grant.membershipId === membershipId
                      ? { ...grant, canSend }
                      : grant,
                  ),
                )
              }
              onAssignMember={(member) =>
                setGrants((current) => [
                  ...current,
                  {
                    membershipId: member.membershipId,
                    name: member.name,
                    email: member.email,
                    role: member.role,
                    canSend: true,
                  },
                ])
              }
              onRemoveMember={(membershipId) =>
                setGrants((current) =>
                  current.filter(
                    (grant) => grant.membershipId !== membershipId,
                  ),
                )
              }
            />
          </Section>
        </div>

        <div className="flex min-w-0 flex-col gap-stack">
          {isOAuth && provider ? (
            <Section
              title="Access"
              hint="Widening the grant sends you back to the provider to approve the extra permission. Narrowing it takes effect immediately."
            >
              <div className="flex flex-col gap-row">
                {MAILBOX_SCOPE_LEVELS.map((level) => (
                  <ScopeLevelCard
                    key={level.id}
                    level={level}
                    scopeString={scopeStringFor(level, provider)}
                    isSelected={level.id === scopeId}
                    isRecommended={level.id === "reply"}
                    onSelect={(picked) => setScopeId(picked.id)}
                  />
                ))}
              </div>
            </Section>
          ) : null}

          {!isOAuth && provider ? (
            <Section
              title="Access"
              hint="Leave the password blank to keep the one already stored. Server settings follow the provider."
            >
              <div className="flex flex-col gap-1.5 sm:max-w-72">
                <Label htmlFor={appPasswordId}>Replace app password</Label>
                <Input
                  {...register("appPassword")}
                  id={appPasswordId}
                  type="password"
                  autoComplete="off"
                  placeholder="Leave blank to keep current"
                  className="font-mono"
                />
              </div>
              <ServerSettingsFields provider={provider} />
            </Section>
          ) : null}
        </div>
      </div>

      <div className="flex flex-none items-center gap-2.5 border-t border-border-2 bg-surface-1 px-panel py-3.5">
        <Button
          type="button"
          variant="outline"
          className="ms-auto h-10 rounded-2xl px-4"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSaving}
          className="h-10 rounded-2xl px-5.5 text-md"
        >
          {isSaving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
};

const EditMailboxDialog = ({
  mailbox,
  provider,
  members,
  isLoadingMembers,
  isSaving,
  onOpenChange,
  onSave,
}: EditMailboxDialogProps) => {
  return (
    <Dialog open={mailbox !== null} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[calc(100vh-3rem)] w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-modal-wide"
      >
        {mailbox ? (
          <>
            <div className="flex flex-none items-center gap-3 border-b border-border-2 px-panel py-4">
              <span
                aria-hidden
                className={cn(
                  "grid size-9.5 flex-none place-items-center rounded-3xl text-md font-extrabold",
                  provider
                    ? providerToneClasses[provider.tone]
                    : "bg-surface-6 text-text-5",
                )}
              >
                {mailbox.monogram}
              </span>
              <div className="min-w-0 flex-1">
                <DialogTitle className="truncate text-lg font-extrabold text-heading">
                  {mailbox.displayName}
                </DialogTitle>
                <DialogDescription className="mt-0.5 truncate font-mono text-sm font-medium text-meta">
                  {mailbox.address}
                </DialogDescription>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Close"
                className="flex-none"
                onClick={() => onOpenChange(false)}
              >
                <X className="size-3.5" aria-hidden />
              </Button>
            </div>

            <EditMailboxForm
              key={`${mailbox.id}:${mailbox.updatedAt}`}
              mailbox={mailbox}
              provider={provider}
              members={members}
              isLoadingMembers={isLoadingMembers}
              isSaving={isSaving}
              onCancel={() => onOpenChange(false)}
              onSave={onSave}
            />
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default EditMailboxDialog;
