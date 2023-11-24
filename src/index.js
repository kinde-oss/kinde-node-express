import { setupInternalClient } from './setup';
import { setupAuthRouter } from './auth';

export * from './helpers';

export const setupKinde = async (config, app) => {
  setupInternalClient(app, config);
  setupAuthRouter(app, '/');
};
