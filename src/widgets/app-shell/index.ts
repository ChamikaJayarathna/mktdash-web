export { default as AppShell } from "./ui/AppShell";
export type { AppShellProps } from "./ui/AppShell";
export { default as AppRail } from "./ui/AppRail";
export type { AppRailProps } from "./ui/AppRail";
export {
  APP_MODULES,
  ORGANISATION_PATH_PREFIX,
  WORKSPACE_PATH_PREFIX,
  buildAppModuleHref,
  buildOrganisationHref,
  buildWorkspaceHref,
  getAppModule,
  resolveActiveAppModuleId,
} from "./model/appModules";
export {
  ACCOUNT_MENU_ITEMS,
  buildAccountMenuHref,
  buildHelpHref,
} from "./model/accountMenu";
export type {
  AccountMenuItem,
  AccountMenuScope,
  AppModule,
  AppModuleCounts,
  AppModuleId,
  AppRailAccount,
} from "./model/appModule.types";
export { workspaceMonogram } from "./lib/workspaceMonogram";
