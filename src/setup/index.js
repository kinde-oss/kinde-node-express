import { setupKindeSession } from './sessionManager';
import { setupInternalClient as setupKindeClient } from './kindeClient';

export { getInternalClient, getInitialConfig } from './kindeClient';

/**
 * Encapsulates Kinde setup of creatint creating internal TypeScript SDK
 * client, setting up its session manager interface and attaching session
 * manager to provided express instance.
 *
 * @param {import('express').Express} app
 * @param {import('./kindeClient').SetupConfig} config
 */
export const setupInternalClient = (app, config) => {
  setupKindeSession(app);
  setupKindeClient(config);
};
