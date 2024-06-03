import { getAuthRouter } from './kindeAuthRouter.js';
import type { Express } from 'express';

export { validateQueryParams } from './kindeAuthRouter.js';

/**
 * Attaches auth router to provided express instance.
 *
 * @param {Express} app
 * @param {string} route base route for auth router
 */
export const setupAuthRouter = (app: Express, route: string): void => {
  app.use(route, getAuthRouter());
};
