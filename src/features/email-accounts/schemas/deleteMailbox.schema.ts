import { z } from "zod";

export const buildDeleteMailboxSchema = (address: string) =>
  z.object({
    confirmation: z
      .string()
      .trim()
      .refine((value) => value === address, {
        message: `Type ${address} exactly to confirm.`,
      }),
  });

export type DeleteMailboxValues = z.infer<
  ReturnType<typeof buildDeleteMailboxSchema>
>;
