"use client";

import { useId } from "react";
import Link from "next/link";
import { useFormContext, useWatch } from "react-hook-form";
import { CircleAlert } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { cn } from "@/shared/lib/utils";
import { getPasswordStrength } from "../lib/passwordStrength";
import type { SignUpFormValues } from "../schemas/signUp.schema";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

export interface SignUpAccountStepProps {
  readonly isPasswordVisible: boolean;
  readonly onPasswordVisibilityToggle: () => void;
}

const SignUpAccountStep = ({
  isPasswordVisible,
  onPasswordVisibilityToggle,
}: SignUpAccountStepProps) => {
  const {
    control,
    formState: { errors },
    register,
  } = useFormContext<SignUpFormValues>();

  const fullNameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const emailErrorId = `${emailId}-error`;
  const emailHintId = `${emailId}-hint`;
  const fullNameErrorId = `${fullNameId}-error`;
  const passwordErrorId = `${passwordId}-error`;
  const passwordHintId = `${passwordId}-hint`;
  const passwordStrengthId = `${passwordId}-strength`;

  const password = useWatch({ control, name: "password" });
  const fullName = useWatch({ control, name: "fullName" });
  const email = useWatch({ control, name: "email" });

  const strength = getPasswordStrength(password ?? "");
  const canContinue =
    Boolean(fullName?.trim()) &&
    Boolean(email?.trim()) &&
    strength.isAcceptable;

  return (
    <>
      <h1 className="type-title text-heading">Create your account</h1>
      <p className="mt-1.75 text-md leading-normal font-medium text-text-6">
        Three fields. You will name your workspace next.
      </p>

      <div className="mt-6.5 flex flex-col gap-3.75">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={fullNameId}>Full name</Label>
          <Input
            {...register("fullName")}
            id={fullNameId}
            autoComplete="name"
            autoFocus
            placeholder="Your Name"
            aria-invalid={errors.fullName ? true : undefined}
            aria-describedby={errors.fullName ? fullNameErrorId : undefined}
            className="h-10.5 rounded-2xl text-md"
          />
          {errors?.fullName ? (
            <p
              id={fullNameErrorId}
              className="text-xs font-bold text-danger-600"
            >
              {errors.fullName.message}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={emailId}>Work email</Label>
          <Input
            {...register("email")}
            id={emailId}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={[errors.email ? emailErrorId : null, emailHintId]
              .filter(Boolean)
              .join(" ")}
            className="h-10.5 rounded-2xl font-mono text-md"
          />
          {errors?.email ? (
            <p id={emailErrorId} className="text-xs font-bold text-danger-600">
              {errors.email.message}
            </p>
          ) : null}
          <p
            id={emailHintId}
            className="text-xs leading-normal font-medium text-text-8"
          >
            Use a company address. Colleagues on the same domain can be invited
            to your workspace later.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between gap-3">
            <Label htmlFor={passwordId}>Password</Label>
            <Button
              type="button"
              variant="link"
              size="xs"
              aria-pressed={isPasswordVisible}
              aria-controls={passwordId}
              onClick={onPasswordVisibilityToggle}
              className="h-auto px-0 text-sm text-link hover:text-link-hover"
            >
              {isPasswordVisible ? "Hide" : "Show"}
            </Button>
          </div>
          <Input
            {...register("password")}
            id={passwordId}
            type={isPasswordVisible ? "text" : "password"}
            autoComplete="new-password"
            placeholder="A phrase you will remember"
            aria-invalid={errors.password ? true : undefined}
            aria-describedby={[
              errors.password && !strength.isBreached ? passwordErrorId : null,
              passwordStrengthId,
              passwordHintId,
            ]
              .filter(Boolean)
              .join(" ")}
            className="h-10.5 rounded-2xl text-md"
          />

          <div className="mt-1">
            <PasswordStrengthMeter
              strength={strength}
              characterCount={password?.length ?? 0}
              labelId={passwordStrengthId}
            />
          </div>

          {strength.isBreached ? (
            <div
              role="alert"
              className="mt-1 flex animate-fa-in items-start gap-2.25 rounded-2xl border border-danger-100 bg-danger-050 px-3 py-2.5"
            >
              <CircleAlert
                aria-hidden
                className="mt-px size-3.25 flex-none text-danger-600"
                strokeWidth={2}
              />
              <p className="text-xs leading-normal font-medium text-danger-600">
                This password appears in known breach lists. Pick another — we
                check every new password against those lists rather than forcing
                symbols and capitals.
              </p>
            </div>
          ) : errors?.password ? (
            <p
              id={passwordErrorId}
              className="text-xs font-bold text-danger-600"
            >
              {errors.password.message}
            </p>
          ) : null}

          <p
            id={passwordHintId}
            className="mt-1 text-xs leading-normal font-medium text-text-8"
          >
            Length is what matters. A memorable phrase of four ordinary words
            beats a short string of symbols. No capitals, digits or punctuation
            are required.
          </p>
        </div>

        <Button
          type="submit"
          className={cn(
            "h-11 w-full rounded-3xl text-md",
            !canContinue &&
              "bg-surface-6 text-text-9 shadow-none hover:bg-surface-5 hover:text-text-5 hover:shadow-none",
          )}
        >
          Continue
        </Button>

        <p className="text-center text-xs leading-normal font-medium text-text-8">
          By continuing you agree to the{" "}
          <Link
            href="/terms"
            className="font-bold text-link hover:text-link-hover"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="font-bold text-link hover:text-link-hover"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <p className="mt-6 border-t border-border-2 pt-4.5 text-base leading-normal font-medium text-text-6">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-bold text-link hover:text-link-hover"
        >
          Sign in
        </Link>
      </p>
    </>
  );
};

export default SignUpAccountStep;
