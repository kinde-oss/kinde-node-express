import { ExpressMiddleware, randomString } from '../utils';
import type { Express, Request, Response, NextFunction } from 'express';
import session, { type SessionOptions } from 'express-session';

const SESSION_MAX_AGE: number = 1000 * 60 * 60 * 24;

const sessionConfig: SessionOptions = {
  secret: randomString(),
  saveUninitialized: true,
  cookie: { maxAge: SESSION_MAX_AGE },
  resave: false,
};

/**
 * Sets up @type{import('@kinde-oss/kinde-typescript-sdk').SessionManager} as an
 * as an express middleware, with the assumption that `express-session` package
 * middleware has already been configured.
 *
 * @returns {ExpressMiddleware}
 */
const getSessionManager = (): ExpressMiddleware<void> => {
  return (req: Request, _: Response, next: NextFunction) => {
    req.setSessionItem = async (itemKey, itemValue) => {
      req.session[itemKey] = itemValue;
    };
    req.getSessionItem = async (itemKey) => {
      return req.session[itemKey] ?? null;
    };
    req.removeSessionItem = async (itemKey) => {
      delete req.session[itemKey];
    };
    req.destroySession = async () => {
      req.session.destroy((e) => console.log(e));
    };
    next();
  };
};

/**
 * Attaches the `express-session` middleware and the `SessionManager` for internal
 * typescript SDK (in middleware form).
 * @param {Express} app
 */
export const setupKindeSession = (app: Express): void => {
  app.use(session(sessionConfig));
  app.use(getSessionManager());
};
