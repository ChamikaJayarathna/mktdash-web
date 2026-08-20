export { default as VerifyEmailForm } from "./components/VerifyEmailForm";
export type { VerifyEmailFormProps } from "./components/VerifyEmailForm";
export {
  verifyEmailSchema,
  type VerifyEmailFormValues,
} from "./schemas/verifyEmail.schema";
export {
  MAX_VERIFICATION_ATTEMPTS,
  RESEND_COOLDOWN_SECONDS,
  VERIFICATION_CODE_LENGTH,
  formatCooldown,
  isCompleteVerificationCode,
  isLikelyEmailAddress,
  sanitiseVerificationCode,
  toVerificationCodeSlots,
} from "./lib/verificationCode";
export type {
  ResendVerificationFailureCode,
  ResendVerificationOutcome,
  ResendVerificationRequest,
  VerifyEmailFailureCode,
  VerifyEmailOutcome,
  VerifyEmailRequest,
} from "./types/verifyEmail.types";
