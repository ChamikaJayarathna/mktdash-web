"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, KeyRound } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { signIn } from "../api/signIn";
import { signInSchema, type SignInFormValues } from "../schemas/signIn.schema";
import type { SignInFailureCode } from "../types/signIn.types";
import PasswordField from "./PasswordField";

export interface SignInFormProps {
  readonly showSso?: boolean;
}

const FAILURE_MESSAGE: Record<SignInFailureCode, string> = {
  "invalid-credentials":
    "That email and password combination is not recognised. Check both and try again.",
  "not-configured":
    "Sign-in is not connected yet. Nothing was sent — try again once your workspace has been set up.",
};

const SignInForm = ({ showSso = true }: SignInFormProps) => {
  const router = useRouter();
  const emailId = useId();
  const passwordId = useId();
  const rememberId = useId();
  const emailErrorId = `${emailId}-error`;
  const passwordErrorId = `${passwordId}-error`;

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [failureCode, setFailureCode] = useState<SignInFailureCode | null>(
    null,
  );

  const {
    control,
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", rememberMe: true },
  });

  const onSubmit = handleSubmit(async (values) => {
    setFailureCode(null);
    const outcome = await signIn(values);

    if (outcome.status === "failed") {
      setFailureCode(outcome.code);
      return;
    }

    router.replace(outcome.redirectTo);
  });

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-col gap-3.75">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={emailId}>Email address</Label>
        <Input
          {...register("email")}
          id={emailId}
          type="email"
          inputMode="email"
          autoComplete="email"
          autoFocus
          placeholder="you@company.com"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? emailErrorId : undefined}
          className="h-10.5 rounded-2xl font-mono text-md"
        />
        {errors?.email ? (
          <p id={emailErrorId} className="text-xs font-bold text-danger-600">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between gap-3">
          <Label htmlFor={passwordId}>Password</Label>
          <Link
            href="/forgot-password"
            className="text-sm font-bold text-link hover:text-link-hover"
          >
            Forgot password?
          </Link>
        </div>
        <PasswordField
          {...register("password")}
          id={passwordId}
          autoComplete="current-password"
          placeholder="Your password"
          isVisible={isPasswordVisible}
          onVisibilityToggle={() => setIsPasswordVisible((visible) => !visible)}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={errors.password ? passwordErrorId : undefined}
        />
        {errors?.password ? (
          <p id={passwordErrorId} className="text-xs font-bold text-danger-600">
            {errors.password.message}
          </p>
        ) : null}
      </div>

      {failureCode ? (
        <div
          role="alert"
          className="flex animate-fa-in items-start gap-2.25 rounded-2xl border border-danger-100 bg-danger-050 px-3.25 py-2.75"
        >
          <CircleAlert
            aria-hidden
            className="mt-px size-3.5 flex-none text-danger-600"
            strokeWidth={2}
          />
          <p className="text-base leading-normal font-medium text-danger-600">
            {FAILURE_MESSAGE[failureCode]}
          </p>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name="rememberMe"
          render={({ field }) => (
            <Checkbox
              id={rememberId}
              name={field.name}
              checked={field.value}
              onCheckedChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        <Label
          htmlFor={rememberId}
          className="cursor-pointer font-medium text-text-4"
        >
          Keep me signed in
        </Label>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full rounded-3xl text-md"
      >
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>

      {showSso ? (
        <>
          <div className="flex items-center gap-3">
            <span aria-hidden className="h-px flex-1 bg-border-2" />
            <span className="type-eyebrow text-eyebrow">or</span>
            <span aria-hidden className="h-px flex-1 bg-border-2" />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => setFailureCode("not-configured")}
            className="h-11 w-full rounded-3xl text-md"
          >
            <KeyRound />
            Continue with SSO
          </Button>
        </>
      ) : null}
    </form>
  );
};

export default SignInForm;
