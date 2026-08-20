"use client";

import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { formatCooldown } from "../lib/verificationCode";

export interface VerifyEmailResendPromptProps {
  readonly isResending: boolean;
  readonly secondsRemaining: number;
  readonly notice: string | null;
  readonly errorMessage: string | null;
  readonly onResend: () => void;
}

const VerifyEmailResendPrompt = ({
  isResending,
  secondsRemaining,
  notice,
  errorMessage,
  onResend,
}: VerifyEmailResendPromptProps) => {
  const isCoolingDown = secondsRemaining > 0;

  const isWaiting = isResending || isCoolingDown;

  const resendLabel = isResending
    ? "Sending…"
    : isCoolingDown
      ? `Resend in ${formatCooldown(secondsRemaining)}`
      : "Resend code";

  return (
    <div className="mt-4.5 flex flex-col items-center gap-1.5 text-center">
      <p className="text-base leading-normal font-medium text-text-6">
        Didn’t get the code?{" "}
        <Button
          type="button"
          variant="link"
          size="xs"
          onClick={onResend}
          disabled={isWaiting}
          className={cn(
            "h-auto px-0 text-base",
            isWaiting
              ? "font-medium text-text-8 hover:no-underline disabled:opacity-100"
              : "text-link hover:text-link-hover",
          )}
        >
          {resendLabel}
        </Button>
      </p>

      <p className="text-xs leading-normal font-medium text-text-8">
        Check your spam folder, or{" "}
        <Link
          href="/sign-up"
          className="font-bold text-link hover:text-link-hover"
        >
          use a different address
        </Link>
        .
      </p>

      <p
        role="status"
        className={cn(
          "animate-fa-in text-sm font-bold text-success-600",
          !notice && "sr-only",
        )}
      >
        {notice ?? ""}
      </p>

      {errorMessage ? (
        <p role="alert" className="text-sm font-bold text-danger-600">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
};

export default VerifyEmailResendPrompt;
