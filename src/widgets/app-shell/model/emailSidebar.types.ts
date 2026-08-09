export type EmailDestinationId =
  | "inbox"
  | "drafts"
  | "sent"
  | "follow-ups"
  | "templates"
  | "signatures"
  | "accounts";

export interface EmailDestination {
  readonly id: EmailDestinationId;
  readonly label: string;
  readonly segments: readonly string[];
  readonly countNoun: string;
}

export type EmailDestinationCounts = Partial<
  Record<EmailDestinationId, number>
>;
