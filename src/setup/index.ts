import { setupKindeSession } from './sessionManager';
import type { Express } from 'express';
import {
  setupInternalClient as setupKindeClient,
  type SetupConfig,
} from './kindeClient';

export { getInternalClient, getInitialConfig } from './kindeClient';
export { type SetupConfig };

/**
 * Encapsulates Kinde setup of creatint creating internal TypeScript SDK
 * client, setting up its session manager interface and attaching session
 * manager to provided express instance.
 *
 * @param {import('express').Express} app
 * @param {import('./kindeClient').SetupConfig} config
 */
export const setupInternalClient = (app: Express, config: SetupConfig): void => {
  setupKindeSession(app);
  setupKindeClient(config);
};
