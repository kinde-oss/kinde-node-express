import { randomString } from '../utils';
import session from 'express-session';

const SESSION_MAX_AGE = 1000 * 60 * 60 * 24;

const sessionConfig = {
  secret: randomString(),
  saveUninitialized: true,
  cookie: { maxAge: SESSION_MAX_AGE },
  resave: false,
};

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

export const setupKindeSession = (app) => {
  app.use(session(sessionConfig));
  app.use(getSessionManager());
};
