import { z } from "zod";
import {
  isBreachedPassword,
  MIN_PASSWORD_LENGTH,
} from "../lib/passwordStrength";
import { TENANCY_MODES } from "../types/signUp.types";

export const signUpAccountSchema = z.object({
  fullName: z.string().trim().min(1, "Enter your full name"),
  email: z
    .string()
    .trim()
    .min(1, "Enter your work email")
    .pipe(z.email("Enter a valid email address")),
  password: z
    .string()
    .min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters`)
    .refine(
      (password) => !isBreachedPassword(password),
      "This password appears in known breach lists. Pick another.",
    ),
});

export const signUpWorkspaceSchema = z.object({
  workspaceName: z.string().trim().min(1, "Give your workspace a name"),
  tenancy: z.enum(TENANCY_MODES),
});

export const signUpSchema = signUpAccountSchema.extend(
  signUpWorkspaceSchema.shape,
);

export type SignUpFormValues = z.infer<typeof signUpSchema>;
