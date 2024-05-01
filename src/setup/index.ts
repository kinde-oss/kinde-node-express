import { setupKindeSession } from './sessionManager';
import { setupInternalClient as setupKindeClient } from './kindeClient';
import { type GrantType } from '@kinde-oss/kinde-typescript-sdk';
import { type SetupConfig } from './kindeSetupTypes';
import type { Express } from 'express';
import session from 'express-session';

export { getInternalClient, getInitialConfig } from './kindeClient';
export * from './kindeSetupTypes';

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
  config: SetupConfig<G>,
  sessionOptions?: session.SessionOptions
): void => {
  setupKindeSession(app, sessionOptions);
  setupKindeClient(config);
};
