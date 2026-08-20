"use client";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { resendVerificationCode } from "../api/verifyEmailService";
import type {
  ResendVerificationOutcome,
  ResendVerificationRequest,
} from "../types/verifyEmail.types";

export const useResendVerificationCode = (): UseMutationResult<
  ResendVerificationOutcome,
  Error,
  ResendVerificationRequest
> =>
  useMutation({
    mutationFn: resendVerificationCode,
  });
