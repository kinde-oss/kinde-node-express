import { managementApi, GrantType } from '@kinde-oss/kinde-typescript-sdk';
import { type SetupConfig, getInternalClient, setupInternalClient } from './setup';
import { setupAuthRouter } from './auth';
import type { Express } from 'express';

export * from './helpers';
export { managementApi, GrantType };

/**
 * Encapsulates Kinde setup by completing creating internal TypeScript SDK
 * client, setting up its session manager interface and attaching auth router
 * to provided express instance.
 *
 * @param {Express} app
 * @param {SetupConfig} config
 */
export const setupKinde = async <G extends GrantType>(
  config: SetupConfig<G>,
  app: Express
) => {
  setupInternalClient(app, config);
  setupAuthRouter(app, '/');
  return getInternalClient();
};
