// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*", ".agents/**"],
  },
  {
    // jest.mock() factories are hoisted above imports, so referencing helpers like RN
    // primitives inside them must use require() — ES imports aren't available yet at
    // that point in the module.
    files: ["**/*.test.ts", "**/*.test.tsx"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },
  {
    // Runs inside Jest's environment, but eslint-config-expo only grants jest
    // globals to *.test.* files — declare them here so no-undef doesn't fire.
    files: ["jest.setup.js"],
    languageOptions: {
      globals: {
        jest: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        beforeAll: "readonly",
        afterAll: "readonly",
      },
    },
  },
]);
