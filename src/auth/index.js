import { getAuthRouter } from './kindeAuthRouter';

export { validateQueryParams } from './kindeAuthRouter';

/**
 * Attaches auth router to provided express instance.
 *
 * @param {import('express').Express} app
 * @param {string} route base route for auth router
 */
export const setupAuthRouter = (app, route) => {
  app.use(route, getAuthRouter());
};
