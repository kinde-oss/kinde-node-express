import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  { languageOptions: { globals: globals.browser } },
  globalIgnores(["dist", "node_modules", "lib/coverage/**"]),
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
]);
