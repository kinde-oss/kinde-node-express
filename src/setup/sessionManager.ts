import { ExpressMiddleware, randomString } from "../utils.js";
import type { Express, Request, Response, NextFunction } from "express";
import session, { type SessionOptions } from "express-session";
import { ExpressSessionManager } from "@kinde/js-utils";

const SESSION_MAX_AGE: number = 1000 * 60 * 60 * 24;

const sessionConfig: SessionOptions = {
  secret: process.env.SESSION_SECRET || randomString(),
  saveUninitialized: true,
  cookie: {
    maxAge: SESSION_MAX_AGE,
    sameSite: "lax",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  },
  resave: false,
};

/**
 * Sets up the session manager by creating an instance of the
 * `ExpressSessionManager` class from @kinde/js-utils for each request.
 *
 * @returns {ExpressMiddleware}
 */
export const getSessionManager = (): ExpressMiddleware<void> => {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      // Ensuring the session is initialized
      const manager = new ExpressSessionManager(req);

      // Now bridging the methods from @kinde/js-utils to req object
      req.setSessionItem = manager.setSessionItem.bind(manager);
      req.getSessionItem = manager.getSessionItem.bind(manager);
      req.removeSessionItem = manager.removeSessionItem.bind(manager);
      req.destroySession = manager.destroySession.bind(manager);

      next();
    } catch (error) {
      next(error);
    }
  };
};

const hasSessionMiddleware = (app: Express) => {
  if (app._router && app._router.stack) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return app._router.stack.some((l: any) => l.name === "session");
  }
  return false;
};

/**
 * Attaches the `express-session` middleware and the Kinde ExpressSessionManager.
 * @param {Express} app
 */
export const setupKindeSession = (app: Express): void => {
  if (!hasSessionMiddleware(app)) {
    app.use(session(sessionConfig));
  }
  app.use(getSessionManager());
};
