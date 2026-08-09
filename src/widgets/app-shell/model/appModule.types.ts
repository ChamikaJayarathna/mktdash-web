import type { LucideIcon } from "lucide-react";

export type AppModuleId =
  | "home"
  | "email"
  | "whatsapp"
  | "contacts"
  | "sequences"
  | "reports"
  | "admin";

export interface AppModule {
  readonly id: AppModuleId;
  readonly label: string;
  readonly icon: LucideIcon;
  readonly landingSegments: readonly string[];
}

export type AppModuleCounts = Partial<Record<AppModuleId, number>>;

export interface AppRailAccount {
  readonly name: string;
  readonly email: string;
  readonly initials: string;
}

export interface AccountMenuItem {
  readonly id: string;
  readonly label: string;
  readonly note: string;
  readonly scope: "workspace" | "organisation";
  readonly segments: readonly string[];
}

export interface AccountMenuScope {
  readonly workspaceSlug: string;
  readonly organisationSlug?: string;
}
