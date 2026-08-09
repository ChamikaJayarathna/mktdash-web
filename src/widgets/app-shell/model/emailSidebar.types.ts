export type EmailDestinationId =
  | "inbox"
  | "drafts"
  | "sent"
  | "follow-ups"
  | "templates"
  | "signatures"
  | "connections";

export type EmailDestinationTone = "default" | "accent";

export interface EmailDestination {
  readonly id: EmailDestinationId;
  readonly label: string;
  readonly segments: readonly string[];
  readonly tone: EmailDestinationTone;
  readonly countNoun: string;
}

export type EmailDestinationCounts = Partial<
  Record<EmailDestinationId, number>
>;
