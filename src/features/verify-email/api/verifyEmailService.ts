import {
  MAX_VERIFICATION_ATTEMPTS,
  RESEND_COOLDOWN_SECONDS,
  isLikelyEmailAddress,
  sanitiseVerificationCode,
} from "../lib/verificationCode";
import type {
  ResendVerificationOutcome,
  ResendVerificationRequest,
  VerifyEmailOutcome,
  VerifyEmailRequest,
} from "../types/verifyEmail.types";
import {
  PLACEHOLDER_VERIFICATION_CODE,
  PLACEHOLDER_VERIFIED_REDIRECT,
} from "./verifyEmailPlaceholderData";

const NETWORK_DELAY_MS = 220;

// TODO: Drop this in-memory attempt ledger once the identity service is wired
let attemptsByEmail = new Map<string, number>();

export const resetVerificationAttempts = (): void => {
  attemptsByEmail = new Map<string, number>();
};

const delayed = <TValue>(resolveValue: () => TValue): Promise<TValue> =>
  new Promise((resolve) => {
    setTimeout(() => resolve(resolveValue()), NETWORK_DELAY_MS);
  });

export const verifyEmail = ({
  email,
  code,
}: VerifyEmailRequest): Promise<VerifyEmailOutcome> =>
  delayed(() => {
    if (!isLikelyEmailAddress(email)) {
      return { status: "failed", code: "request-failed" };
    }

    const address = email.trim().toLowerCase();
    const attempts = attemptsByEmail.get(address) ?? 0;

    if (attempts >= MAX_VERIFICATION_ATTEMPTS) {
      return { status: "failed", code: "too-many-attempts" };
    }

    if (sanitiseVerificationCode(code) !== PLACEHOLDER_VERIFICATION_CODE) {
      attemptsByEmail.set(address, attempts + 1);

      return {
        status: "failed",
        code:
          attempts + 1 >= MAX_VERIFICATION_ATTEMPTS
            ? "too-many-attempts"
            : "invalid-code",
      };
    }

    attemptsByEmail.delete(address);

    return { status: "verified", redirectTo: PLACEHOLDER_VERIFIED_REDIRECT };
  });

export const resendVerificationCode = ({
  email,
}: ResendVerificationRequest): Promise<ResendVerificationOutcome> =>
  delayed(() => {
    if (!isLikelyEmailAddress(email)) {
      return {
        status: "failed",
        code: "unknown-address",
        retryAfterSeconds: 0,
      };
    }

    attemptsByEmail.delete(email.trim().toLowerCase());

    return { status: "sent", retryAfterSeconds: RESEND_COOLDOWN_SECONDS };
  });
