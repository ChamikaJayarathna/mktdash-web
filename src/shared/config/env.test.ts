import { afterEach, describe, expect, it, vi } from "vitest";

const loadEnv = async (overrides: Record<string, string | undefined>) => {
  for (const [key, value] of Object.entries(overrides)) {
    vi.stubEnv(key, value);
  }

  vi.resetModules();

  const { env } = await import("./env");

  return env;
};

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("env", () => {
  it("falls back to defaults so a fresh clone boots with no .env file", async () => {
    const env = await loadEnv({
      CI: undefined,
      PLAYWRIGHT_BASE_URL: undefined,
      NEXT_PUBLIC_APP_URL: undefined,
    });

    expect(env.CI).toBe(false);
    expect(env.PLAYWRIGHT_BASE_URL).toBe("http://localhost:3000");
    expect(env.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
  });

  it("treats an empty assignment as unset rather than as an empty string", async () => {
    const env = await loadEnv({ NEXT_PUBLIC_APP_URL: "" });

    expect(env.NEXT_PUBLIC_APP_URL).toBe("http://localhost:3000");
  });

  it("parses CI as a boolean, so CI=false disables CI behaviour", async () => {
    await expect(loadEnv({ CI: "false" })).resolves.toMatchObject({
      CI: false,
    });
    await expect(loadEnv({ CI: "true" })).resolves.toMatchObject({ CI: true });
  });

  it("rejects a malformed URL instead of shipping it", async () => {
    await expect(loadEnv({ NEXT_PUBLIC_APP_URL: "notaurl" })).rejects.toThrow(
      /Invalid environment variables[\s\S]*NEXT_PUBLIC_APP_URL/,
    );
  });

  it("rejects an unknown NODE_ENV", async () => {
    await expect(loadEnv({ NODE_ENV: "staging" })).rejects.toThrow(
      /Invalid environment variables[\s\S]*NODE_ENV/,
    );
  });
});
