import { getAuthRouter } from './kindeAuthRouter';

export const setupAuthRouter = (app, route) => {
  app.use(route, getAuthRouter());
};
