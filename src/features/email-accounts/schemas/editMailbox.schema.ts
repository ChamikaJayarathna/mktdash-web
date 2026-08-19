import { z } from "zod";
import { isWindowOrdered } from "../lib/sendingWindow";

export const MAX_DAILY_CAP = 2000;

const weekdaySchema = z.enum(["mon", "tue", "wed", "thu", "fri", "sat", "sun"]);

export const editMailboxSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(1, "Give this mailbox a name your team will recognise."),
    dailyCap: z
      .number({ error: "Enter a daily send cap." })
      .int("Use a whole number of sends.")
      .min(1, "A mailbox must be allowed at least one send a day.")
      .max(MAX_DAILY_CAP, `Keep the cap at or below ${MAX_DAILY_CAP} sends.`),
    days: z.array(weekdaySchema).min(1, "Pick at least one sending day."),
    startTime: z.string(),
    endTime: z.string(),
    timeZone: z.string().min(1, "Choose a timezone."),
    appPassword: z.string(),
  })
  .refine((values) => isWindowOrdered(values.startTime, values.endTime), {
    path: ["endTime"],
    message: "The window must end after it starts.",
  });

export type EditMailboxValues = z.infer<typeof editMailboxSchema>;
