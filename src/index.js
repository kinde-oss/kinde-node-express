import { setupInternalClient } from './setup';
import { setupAuthRouter } from './auth';

export * from './helpers';

/**
 * Encapsulates Kinde setup by completing creating internal TypeScript SDK
 * client, setting up its session manager interface and attaching auth router
 * to provided express instance.
 *
 * @param {import('express').Express} app
 * @param {import('./kindeClient').SetupConfig} config
 */
export const setupKinde = async (config, app) => {
  setupInternalClient(app, config);
  setupAuthRouter(app, '/');
};
