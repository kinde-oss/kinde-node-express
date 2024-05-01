import { type SetupConfig, getInternalClient, setupInternalClient } from './setup';
import { setupAuthRouter } from './auth';
import type { Express } from 'express';

import {
  managementApi,
  GrantType,
  ConfigurationParameters,
  Configuration,
} from '@kinde-oss/kinde-typescript-sdk';
import session from 'express-session';

export * from './helpers';
export { managementApi, GrantType, ConfigurationParameters, Configuration };

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
  app: Express,
  sessionOptions?: session.SessionOptions
) => {
  setupInternalClient(app, config, sessionOptions);
  setupAuthRouter(app, '/');
  return getInternalClient();
};
