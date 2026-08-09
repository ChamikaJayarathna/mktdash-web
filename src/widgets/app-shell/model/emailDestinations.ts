import { WORKSPACE_PATH_PREFIX, buildWorkspaceHref } from "./appModules";
import type {
  EmailDestination,
  EmailDestinationId,
} from "./emailSidebar.types";

export const EMAIL_MODULE_SEGMENT = "email";

export const EMAIL_DESTINATIONS: readonly EmailDestination[] = [
  { id: "inbox", label: "Inbox", segments: ["inbox"], countNoun: "unread" },
  { id: "drafts", label: "Drafts", segments: ["drafts"], countNoun: "saved" },
  { id: "sent", label: "Sent", segments: ["sent"], countNoun: "sent" },
  {
    id: "follow-ups",
    label: "Follow-ups",
    segments: ["follow-ups", "queue"],
    countNoun: "queued",
  },
  {
    id: "templates",
    label: "Templates",
    segments: ["templates"],
    countNoun: "available",
  },
  {
    id: "signatures",
    label: "Signatures",
    segments: ["signatures"],
    countNoun: "available",
  },
  {
    id: "accounts",
    label: "Accounts",
    segments: ["accounts"],
    countNoun: "connected",
  },
];

const EMAIL_DESTINATIONS_BY_ID = new Map<EmailDestinationId, EmailDestination>(
  EMAIL_DESTINATIONS.map((destination) => [destination.id, destination]),
);

const EMAIL_DESTINATION_ID_BY_SEGMENT = new Map<string, EmailDestinationId>(
  EMAIL_DESTINATIONS.map((destination) => [
    destination.segments[0],
    destination.id,
  ]),
);

export const getEmailDestination = (
  destinationId: EmailDestinationId,
): EmailDestination => {
  const destination = EMAIL_DESTINATIONS_BY_ID.get(destinationId);

  if (!destination) {
    throw new Error(`Unknown email destination: ${destinationId}`);
  }

  return destination;
};

export const buildEmailModuleHref = (workspaceSlug: string): string =>
  `${buildWorkspaceHref(workspaceSlug)}/${EMAIL_MODULE_SEGMENT}`;

export const buildEmailDestinationHref = (
  workspaceSlug: string,
  destinationId: EmailDestinationId,
): string =>
  [
    buildEmailModuleHref(workspaceSlug),
    ...getEmailDestination(destinationId).segments,
  ].join("/");

export const resolveActiveEmailDestinationId = (
  pathname: string | null,
  workspaceSlug: string,
): EmailDestinationId | null => {
  const [prefix, slug, moduleSegment, destinationSegment] = (pathname ?? "")
    .split("/")
    .filter(Boolean);

  if (
    prefix !== WORKSPACE_PATH_PREFIX ||
    slug !== workspaceSlug ||
    moduleSegment !== EMAIL_MODULE_SEGMENT ||
    !destinationSegment
  ) {
    return null;
  }

  return EMAIL_DESTINATION_ID_BY_SEGMENT.get(destinationSegment) ?? null;
};
