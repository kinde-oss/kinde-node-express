import { getAuthRouter } from './kindeAuthRouter';
import type { Express } from 'express';

export { validateQueryParams } from './kindeAuthRouter';

/**
 * Attaches auth router to provided express instance.
 *
 * @param {import('express').Express} app
 * @param {string} route base route for auth router
 */
export const setupAuthRouter = (app: Express, route: string): void => {
  app.use(route, getAuthRouter());
};
