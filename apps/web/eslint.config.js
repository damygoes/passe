import { nextJsConfig } from "@passe/eslint-config/next-js";

/** @type {import("eslint").Linter.Config[]} */
export default [
  ...nextJsConfig,
  {
    files: ["next.config.js"],
    languageOptions: {
      globals: { process: "readonly" },
    },
  },
];
