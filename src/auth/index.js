import { getAuthRouter } from './authRouter';

export const setupAuthRouter = (app, route) => {
  app.use(route, getAuthRouter());
}
