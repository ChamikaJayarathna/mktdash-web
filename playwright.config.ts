import { defineConfig, devices } from "@playwright/test";
import { env } from "./src/shared/config/env";

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: true,
  forbidOnly: env.CI,
  retries: env.CI ? 2 : 0,
  reporter: env.CI ? "github" : "list",
  use: {
    baseURL: env.PLAYWRIGHT_BASE_URL,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: env.CI ? "pnpm build && pnpm start" : "pnpm dev",
    url: env.PLAYWRIGHT_BASE_URL,
    reuseExistingServer: !env.CI,
    timeout: 180_000,
  },
});
