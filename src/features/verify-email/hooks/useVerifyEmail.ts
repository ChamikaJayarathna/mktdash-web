"use client";

import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { verifyEmail } from "../api/verifyEmailService";
import type {
  VerifyEmailOutcome,
  VerifyEmailRequest,
} from "../types/verifyEmail.types";

export const useVerifyEmail = (): UseMutationResult<
  VerifyEmailOutcome,
  Error,
  VerifyEmailRequest
> =>
  useMutation({
    mutationFn: verifyEmail,
  });
