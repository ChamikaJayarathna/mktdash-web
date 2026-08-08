import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Enter your email address")
    .pipe(z.email("Enter a valid email address")),
  password: z.string().min(1, "Enter your password"),
  rememberMe: z.boolean(),
});

export type SignInFormValues = z.infer<typeof signInSchema>;
