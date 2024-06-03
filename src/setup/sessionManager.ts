import { ExpressMiddleware, randomString } from '../utils.js';
import type { Express, Request, Response, NextFunction } from 'express';
import session, { type SessionOptions } from 'express-session';

const SESSION_MAX_AGE: number = 1000 * 60 * 60 * 24;

const sessionConfig: SessionOptions = {
  secret: process.env.SESSION_SECRET || randomString(),
  saveUninitialized: true,
  cookie: {
    maxAge: SESSION_MAX_AGE,
    sameSite: 'lax',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  },
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

const hasSessionMiddleware = (app: Express) => {
  if (app._router && app._router.stack) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return app._router.stack.some((l: any) => l.name === 'session');
  }
  return false;
};

/**
 * Attaches the `express-session` middleware and the `SessionManager` for internal
 * typescript SDK (in middleware form).
 * @param {Express} app
 */
export const setupKindeSession = (app: Express): void => {
  if (!hasSessionMiddleware(app)) {
    app.use(session(sessionConfig));
  }
  app.use(getSessionManager());
};
