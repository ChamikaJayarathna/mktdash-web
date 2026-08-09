import type { AccountMenuItem, AccountMenuScope } from "./appModule.types";
import { buildOrganisationHref, buildWorkspaceHref } from "./appModules";

export const HELP_SEGMENT = "help";

export const ACCOUNT_MENU_ITEMS: readonly AccountMenuItem[] = [
  {
    id: "profile",
    label: "My profile",
    note: "Name, photo, personal signature",
    scope: "workspace",
    segments: ["account", "profile"],
  },
  {
    id: "connections",
    label: "Connected accounts",
    note: "Mailboxes and WhatsApp numbers you can send from",
    scope: "workspace",
    segments: ["email", "connections"],
  },
  {
    id: "preferences",
    label: "Preferences",
    note: "Language, timezone, default sender",
    scope: "workspace",
    segments: ["account", "preferences"],
  },
  {
    id: "appearance",
    label: "Appearance",
    note: "Theme, density, thread grouping",
    scope: "workspace",
    segments: ["account", "appearance"],
  },
  {
    id: "notifications",
    label: "Notifications",
    note: "Email, desktop, digest schedule",
    scope: "workspace",
    segments: ["account", "notifications"],
  },
  {
    id: "security",
    label: "Security",
    note: "Multi-factor authentication and active sessions",
    scope: "workspace",
    segments: ["account", "security"],
  },
  {
    id: "api-keys",
    label: "API keys",
    note: "Personal access keys and their last use",
    scope: "workspace",
    segments: ["account", "api-keys"],
  },
  {
    id: "billing",
    label: "Billing",
    note: "Plan, seats, and renewal for the organisation",
    scope: "organisation",
    segments: ["billing"],
  },
  {
    id: "support",
    label: "Help and support",
    note: "Docs, keyboard shortcuts, contact",
    scope: "workspace",
    segments: [HELP_SEGMENT],
  },
];

export const buildHelpHref = (workspaceSlug: string): string =>
  `${buildWorkspaceHref(workspaceSlug)}/${HELP_SEGMENT}`;

export const buildAccountMenuHref = (
  item: AccountMenuItem,
  { workspaceSlug, organisationSlug }: AccountMenuScope,
): string | null => {
  if (item.scope === "organisation") {
    return organisationSlug
      ? [buildOrganisationHref(organisationSlug), ...item.segments].join("/")
      : null;
  }

  return [buildWorkspaceHref(workspaceSlug), ...item.segments].join("/");
};
