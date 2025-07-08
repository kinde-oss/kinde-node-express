import type { Express } from "express";
import {
  type SetupConfig,
  getInternalClient,
  setupInternalClient,
} from "./setup/index.js";
import { setupAuthRouter } from "./auth/index.js";
import { jwtVerify } from "./helpers/kindeMiddlewareHelpers.js";
import { setupKindeSession } from "./setup/sessionManager.js";
import type { GrantType } from "@kinde-oss/kinde-typescript-sdk";
export * from "./helpers/index.js";
export { jwtVerify };

/**
 * Encapsulates Kinde setup for an Express application by setting up sessions,
 * creating the client, and attaching authentication routes.
 *
 * @param {SetupConfig} config The Kinde configuration object.
 * @param {Express} app The Express application instance.
 * @returns The initialized Kinde client.
 */
export const setupKinde = <G extends GrantType>(
  config: SetupConfig<G>,
  app: Express
) => {
  // setting up expressSession layer first for Kinde
  setupKindeSession(app);
  // initializing the Kinde SDK client
  setupInternalClient(config);
  // setting up the authentication routes
  setupAuthRouter(app, "/");
  return getInternalClient();
};
