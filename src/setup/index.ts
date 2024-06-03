import { setupKindeSession } from './sessionManager.js';
import { setupInternalClient as setupKindeClient } from './kindeClient.js';
import { type GrantType } from '@kinde-oss/kinde-typescript-sdk';
import { type SetupConfig } from './kindeSetupTypes.js';
import type { Express } from 'express';

export { getInternalClient, getInitialConfig } from './kindeClient.js';
export * from './kindeSetupTypes.js';

/**
 * Encapsulates Kinde setup of creatint creating internal TypeScript SDK
 * client, setting up its session manager interface and attaching session
 * manager to provided express instance.
 *
 * @param {Express} app
 * @param {SetupConfig} config
 */
export const setupInternalClient = <G extends GrantType>(
  app: Express,
  config: SetupConfig<G>
): void => {
  setupKindeSession(app);
  setupKindeClient(config);
};
