import { type SetupConfig, getInternalClient, setupInternalClient } from './setup/index.js';
import { setupAuthRouter } from './auth/index.js';
import type { Express } from 'express';
import { jwtVerify } from './helpers/kindeMiddlewareHelpers.js';

import {
  managementApi,
  GrantType,
  Configuration,
} from '@kinde-oss/kinde-typescript-sdk';

export * from './helpers/index.js';
export {
  managementApi,
  GrantType,
  Configuration,
  jwtVerify,
};

/**
 * Encapsulates Kinde setup by completing creating internal TypeScript SDK
 * client, setting up its session manager interface and attaching auth router
 * to provided express instance.
 *
 * @param {Express} app
 * @param {SetupConfig} config
 */
export const setupKinde = <G extends GrantType>(
  config: SetupConfig<G>,
  app: Express
) => {
  setupInternalClient(app, config);
  setupAuthRouter(app, '/');
  return getInternalClient();
};
