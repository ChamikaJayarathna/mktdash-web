import { z } from "zod";
import { VERIFICATION_CODE_LENGTH } from "../lib/verificationCode";

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(
      new RegExp(`^\\d{${VERIFICATION_CODE_LENGTH}}$`, "u"),
      `Enter the ${VERIFICATION_CODE_LENGTH}-digit code from your email`,
    ),
});

export type VerifyEmailFormValues = z.infer<typeof verifyEmailSchema>;
