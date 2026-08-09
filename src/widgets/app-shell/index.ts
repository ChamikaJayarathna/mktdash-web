export { default as AppShell } from "./ui/AppShell";
export type { AppShellProps } from "./ui/AppShell";
export { default as AppRail } from "./ui/AppRail";
export type { AppRailProps } from "./ui/AppRail";
export {
  APP_MODULES,
  WORKSPACE_PATH_PREFIX,
  buildAppModuleHref,
  buildWorkspaceHref,
  getAppModule,
  resolveActiveAppModuleId,
} from "./model/appModules";
export type {
  AppModule,
  AppModuleCounts,
  AppModuleId,
  AppRailAccount,
} from "./model/appModule.types";
export { workspaceMonogram } from "./lib/workspaceMonogram";
