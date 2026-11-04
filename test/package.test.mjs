import assert from "node:assert/strict";
import { stat } from "node:fs/promises";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const packageJson = require("../package.json");

test("loads the CommonJS public entry point", () => {
  const sdk = require(packageJson.name);

  assert.equal(typeof sdk.setupKinde, "function");
  assert.equal(typeof sdk.protectRoute, "function");
  assert.equal(sdk.GrantType.PKCE, "PKCE");
});

test("loads the ESM public entry point", async () => {
  const sdk = await import(packageJson.name);

  assert.equal(typeof sdk.setupKinde, "function");
  assert.equal(typeof sdk.protectRoute, "function");
  assert.equal(sdk.GrantType.PKCE, "PKCE");
});

test("emits the declared TypeScript entry points", async () => {
  for (const entry of Object.values(packageJson.exports["."])) {
    const declaration = await stat(
      new URL(`../${entry.types}`, import.meta.url),
    );
    assert.ok(declaration.isFile());
  }
});
