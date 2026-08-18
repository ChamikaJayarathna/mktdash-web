import { z } from "zod";

export const connectMailboxSchema = z.object({
  label: z.string().trim().min(1, "Give this mailbox a label."),
  address: z.email("Enter a valid email address."),
  appPassword: z.string(),
});

export type ConnectMailboxValues = z.infer<typeof connectMailboxSchema>;

export const passwordRequiredSchema = connectMailboxSchema.extend({
  appPassword: z
    .string()
    .trim()
    .min(1, "Paste the app-specific password from your provider."),
});
