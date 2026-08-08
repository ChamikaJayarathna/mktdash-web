"use client";

import { useId } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { RadioGroup, RadioGroupItem } from "@/shared/ui/radio-group";
import { cn } from "@/shared/lib/utils";
import type { SignUpFormValues } from "../schemas/signUp.schema";
import type { TenancyMode } from "../types/signUp.types";

export interface SignUpWorkspaceStepProps {
  readonly isSubmitting: boolean;
  readonly onBack: () => void;
}

interface TenancyOption {
  readonly value: TenancyMode;
  readonly label: string;
  readonly note: string;
}

const TENANCY_OPTIONS: readonly TenancyOption[] = [
  {
    value: "company",
    label: "For my own company",
    note: "One workspace for your team.",
  },
  {
    value: "agency",
    label: "For clients I manage",
    note: "A workspace per client, with roll-up reporting.",
  },
];

const SignUpWorkspaceStep = ({
  isSubmitting,
  onBack,
}: SignUpWorkspaceStepProps) => {
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<SignUpFormValues>();

  const workspaceNameId = useId();
  const tenancyLabelId = useId();
  const workspaceNameErrorId = `${workspaceNameId}-error`;

  const workspaceName = useWatch({ control, name: "workspaceName" });
  const canFinish = Boolean(workspaceName?.trim());

  return (
    <>
      <h1 className="type-title text-heading">Name your workspace</h1>
      <p className="mt-1.75 text-md leading-normal font-medium text-text-6">
        A workspace holds your mailboxes, contacts and sequences. Agencies run
        one per client.
      </p>

      <div className="mt-6.5 flex flex-col gap-4.25">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={workspaceNameId}>Workspace name</Label>
          <Input
            {...register("workspaceName")}
            id={workspaceNameId}
            autoComplete="organization"
            autoFocus
            placeholder="Acme Co."
            aria-invalid={errors.workspaceName ? true : undefined}
            aria-describedby={
              errors.workspaceName ? workspaceNameErrorId : undefined
            }
            className="h-10.5 rounded-2xl text-md"
          />
          {errors?.workspaceName ? (
            <p
              id={workspaceNameErrorId}
              className="text-xs font-bold text-danger-600"
            >
              {errors.workspaceName.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <span id={tenancyLabelId} className="type-label text-text-5">
            How will you use Follow Axis?
          </span>
          <Controller
            control={control}
            name="tenancy"
            render={({ field }) => (
              <RadioGroup
                aria-labelledby={tenancyLabelId}
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
                onBlur={field.onBlur}
              >
                {TENANCY_OPTIONS?.map((option) => (
                  <label
                    key={option.value}
                    onClick={() => field.onChange(option.value)}
                    className={cn(
                      "flex cursor-pointer items-start gap-2.75 rounded-3xl border-[1.5px] border-border-4 bg-surface-0 p-3.25 transition-[background-color,border-color] duration-(--dur-hover) ease-out",
                      "hover:border-accent-200",
                      "has-data-checked:border-accent-500 has-data-checked:bg-panel",
                    )}
                  >
                    <RadioGroupItem value={option.value} className="mt-0.75" />
                    <span className="min-w-0 flex-1">
                      <span className="block type-h3 text-heading">
                        {option.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug font-medium text-text-7">
                        {option.note}
                      </span>
                    </span>
                  </label>
                ))}
              </RadioGroup>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            "h-11 w-full rounded-3xl text-md",
            !canFinish &&
              "bg-surface-6 text-text-9 shadow-none hover:bg-surface-5 hover:text-text-5 hover:shadow-none",
          )}
        >
          {isSubmitting ? "Creating workspace…" : "Create workspace"}
        </Button>

        <div className="flex items-start gap-2.25 rounded-2xl border border-accent-150 bg-panel px-3.25 py-2.75">
          <Info
            aria-hidden
            className="mt-px size-3.5 flex-none text-accent-500"
            strokeWidth={2}
          />
          <p className="text-sm leading-normal font-medium text-accent-400">
            You will connect a mailbox and invite your team from inside the app.
            Nothing sends until you connect an account, so there is no way to
            make a mistake here.
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          onClick={onBack}
          className="mx-auto h-8 rounded-2xl text-xs text-text-7"
        >
          <ArrowLeft />
          Back
        </Button>
      </div>
    </>
  );
};

export default SignUpWorkspaceStep;
