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
  readonly initials: string;
}
