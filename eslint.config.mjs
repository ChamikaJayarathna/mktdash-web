import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      "no-restricted-properties": [
        "error",
        {
          object: "process",
          property: "env",
          message:
            "Read validated configuration from `@/shared/config/env` instead of `process.env`. Add the variable to that schema if it is missing.",
        },
      ],
    },
  },
  {
    files: [
      // The schema itself is the one place that reads the raw environment.
      "src/shared/config/env.ts",
      // Documented exception — see the comment at the read site.
      "src/app/providers/QueryProvider.tsx",
    ],
    rules: {
      "no-restricted-properties": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
