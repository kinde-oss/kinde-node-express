import { randomString } from '../utils';
import session from 'express-session';

/**
 * @type{number}
 */
const SESSION_MAX_AGE = 1000 * 60 * 60 * 24;

/**
 * @type{session.SessionOptions}
 */
const sessionConfig = {
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
 * @returns {import('../utils').ExpressMiddleware}
 */
const getSessionManager = () => {
  return (req, _, next) => {
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
      req.session.destroy();
    };
    next();
  };
};

/**
 * Attaches the `express-session` middleware and the `SessionManager` for internal
 * typescript SDK (in middleware form).
 * @param {import('express').Express} app
 */
export const setupKindeSession = (app) => {
  app.use(session(sessionConfig));
  app.use(getSessionManager());
};
