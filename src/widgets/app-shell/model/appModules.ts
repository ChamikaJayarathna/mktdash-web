import {
  ChartColumn,
  House,
  Mail,
  MessageCircle,
  ShieldCheck,
  Users,
  Waypoints,
} from "lucide-react";
import type { AppModule, AppModuleId } from "./appModule.types";

export const WORKSPACE_PATH_PREFIX = "w";
export const ORGANISATION_PATH_PREFIX = "org";

export const APP_MODULES: readonly AppModule[] = [
  { id: "home", label: "Home", icon: House, landingSegments: [] },
  { id: "email", label: "Email", icon: Mail, landingSegments: ["inbox"] },
  {
    id: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    landingSegments: ["conversations"],
  },
  { id: "contacts", label: "Contacts", icon: Users, landingSegments: ["all"] },
  {
    id: "sequences",
    label: "Sequences",
    icon: Waypoints,
    landingSegments: ["campaigns"],
  },
  {
    id: "reports",
    label: "Reports",
    icon: ChartColumn,
    landingSegments: ["channel"],
  },
  {
    id: "admin",
    label: "Admin",
    icon: ShieldCheck,
    landingSegments: ["users"],
  },
];

const APP_MODULES_BY_ID = new Map<AppModuleId, AppModule>(
  APP_MODULES.map((appModule) => [appModule.id, appModule]),
);

export const getAppModule = (moduleId: AppModuleId): AppModule => {
  const appModule = APP_MODULES_BY_ID.get(moduleId);

  if (!appModule) {
    throw new Error(`Unknown app module: ${moduleId}`);
  }

  return appModule;
};

export const buildWorkspaceHref = (workspaceSlug: string): string =>
  `/${WORKSPACE_PATH_PREFIX}/${workspaceSlug}`;

export const buildOrganisationHref = (organisationSlug: string): string =>
  `/${ORGANISATION_PATH_PREFIX}/${organisationSlug}`;

export const buildAppModuleHref = (
  workspaceSlug: string,
  moduleId: AppModuleId,
): string =>
  [
    buildWorkspaceHref(workspaceSlug),
    moduleId,
    ...getAppModule(moduleId).landingSegments,
  ].join("/");

export const resolveActiveAppModuleId = (
  pathname: string | null,
  workspaceSlug: string,
): AppModuleId | null => {
  const segments = (pathname ?? "").split("/").filter(Boolean);

  if (
    segments[0] !== WORKSPACE_PATH_PREFIX ||
    segments[1] !== workspaceSlug ||
    !segments[2]
  ) {
    return null;
  }

  return APP_MODULES_BY_ID.has(segments[2] as AppModuleId)
    ? (segments[2] as AppModuleId)
    : null;
};
