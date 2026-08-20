"use client";

import { useEffect, useState, type SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { signUp } from "../api/signUp";
import { signUpSchema, type SignUpFormValues } from "../schemas/signUp.schema";
import type { SignUpFailureCode, SignUpStep } from "../types/signUp.types";
import SignUpAccountStep from "./SignUpAccountStep";
import SignUpStepIndicator from "./SignUpStepIndicator";
import SignUpWorkspaceStep from "./SignUpWorkspaceStep";

const ACCOUNT_FIELDS = ["fullName", "email", "password"] as const;

const FAILURE_MESSAGE: Record<SignUpFailureCode, string> = {
  "email-taken":
    "An account already exists for that email address. Sign in instead, or use a different one.",
  "password-breached":
    "That password appears in known breach lists. Pick another one before continuing.",
  "not-configured":
    "Sign-up is not connected yet. Nothing was created — try again once your workspace has been set up.",
};

const SignUpForm = () => {
  const router = useRouter();

  const [step, setStep] = useState<SignUpStep>(1);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [failureCode, setFailureCode] = useState<SignUpFailureCode | null>(
    null,
  );

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      workspaceName: "",
      tenancy: "company",
    },
  });

  useEffect(() => {
    return form.subscribe({
      name: ACCOUNT_FIELDS,
      formState: { values: true },
      callback: ({ name }) => {
        const field = ACCOUNT_FIELDS.find((candidate) => candidate === name);
        if (field && form.getFieldState(field).error) {
          void form.trigger(field);
        }
      },
    });
  }, [form]);

  const goToWorkspaceStep = async () => {
    setFailureCode(null);

    const isAccountValid = await form.trigger([...ACCOUNT_FIELDS]);
    if (!isAccountValid) {
      const firstInvalidField = ACCOUNT_FIELDS.find(
        (field) => form.getFieldState(field).invalid,
      );
      if (firstInvalidField) {
        form.setFocus(firstInvalidField);
      }
      return;
    }

    setStep(2);
  };

  const goToAccountStep = () => {
    setFailureCode(null);
    setStep(1);
  };

  const submitSignUp = form.handleSubmit(async (values) => {
    setFailureCode(null);

    const outcome = await signUp(values);

    if (outcome.status === "failed") {
      setFailureCode(outcome.code);
      if (outcome.code !== "not-configured") {
        setStep(1);
      }
      return;
    }

    if (outcome.status === "verification-required") {
      router.replace(
        `/verify-email?email=${encodeURIComponent(outcome.email)}`,
      );
      return;
    }

    router.replace(outcome.redirectTo);
  });

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    if (step === 1) {
      event.preventDefault();
      void goToWorkspaceStep();
      return;
    }

    void submitSignUp(event);
  };

  return (
    <FormProvider {...form}>
      <form noValidate onSubmit={handleSubmit}>
        <div className="mb-4.75">
          <SignUpStepIndicator currentStep={step} />
        </div>

        {failureCode ? (
          <div
            role="alert"
            className="mb-3.75 flex animate-fa-in items-start gap-2.25 rounded-2xl border border-danger-100 bg-danger-050 px-3.25 py-2.75"
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

        {step === 1 ? (
          <SignUpAccountStep
            isPasswordVisible={isPasswordVisible}
            onPasswordVisibilityToggle={() =>
              setIsPasswordVisible((visible) => !visible)
            }
          />
        ) : (
          <SignUpWorkspaceStep
            isSubmitting={form.formState.isSubmitting}
            onBack={goToAccountStep}
          />
        )}
      </form>
    </FormProvider>
  );
};

export default SignUpForm;
