import { z } from "zod";

export const emailRecipientSchema = z.object({
  id: z.string().min(1),
  email: z.email("Enter a valid email address"),
  name: z.string().nullable(),
  contactId: z.string().nullable(),
});

export const draftAttachmentSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  sizeBytes: z.number().int().nonnegative(),
  contentType: z.string().min(1),
});

export const emailDraftSchema = z.object({
  id: z.string().min(1),
  fromAccountId: z.string().nullable(),
  to: z.array(emailRecipientSchema),
  cc: z.array(emailRecipientSchema),
  bcc: z.array(emailRecipientSchema),
  subject: z.string(),
  bodyHtml: z.string(),
  bodyText: z.string(),
  attachments: z.array(draftAttachmentSchema),
  signatureId: z.string().nullable(),
  templateId: z.string().nullable(),
  templateName: z.string().nullable(),
  trackOpens: z.boolean(),
  scheduledAt: z.iso.datetime().nullable(),
  updatedAt: z.iso.datetime(),
});

export const sendableDraftSchema = emailDraftSchema.extend({
  fromAccountId: z.string().min(1, "Choose the mailbox this leaves from"),
  to: z.array(emailRecipientSchema).min(1, "Add at least one recipient"),
});

export type EmailDraftValues = z.infer<typeof emailDraftSchema>;
export type SendableDraftValues = z.infer<typeof sendableDraftSchema>;
