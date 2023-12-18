import { getInitialConfig, getInternalClient } from '../setup';
import { getRequestURL } from '../utils';
import express from 'express';
import type { ParsedQs } from 'qs';
import type { ACClient } from '@kinde-oss/kinde-typescript-sdk';
import type { Request, Response, NextFunction, Router } from 'express';

/**
 * Extracts the redirect route from the redirectUrl provided as part of the
 * initial client configuration.
 *
 * @returns {string}
 */
export const getRedirectRoute = (): string => {
  const { redirectUrl } = getInitialConfig();
  const redirectURL = new URL(redirectUrl);
  return redirectURL.pathname;
};

/**
 * Validates request query parameters for login, regsister and createOrg URLs.
 *
 * @param {object} requestQuery
 * @returns {Error | null}
 */
export const validateQueryParams = (requestQuery: ParsedQs): Error | null => {
  const queryParams = ['org_code'];
  for (const param of queryParams) {
    const value = requestQuery[param];
    if (value !== undefined) {
      if (!value || typeof value !== 'string') {
        const message = `Provided param '${param}' has invalid value '${value}'`;
        return new Error(message);
      }
    }
  }
  return null;
};

/**
 * Creates login URL using internal SDK and redirects to said URL.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>}
 */
const handleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const error = validateQueryParams(req.query);
  if (error !== null) {
    res.status(400);
    return next(error);
  }

  const client = getInternalClient();
  const loginURL = await (client as ACClient).login(req, req.query);
  res.redirect(loginURL.toString());
};

/**
 * Creates register URL using internal SDK and redirects to said URL.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The Express next function.
 * @returns {Promise<void>}
 */
const handleRegister = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const error = validateQueryParams(req.query);
  if (error !== null) {
    res.status(400);
    return next(error);
  }

  const client = getInternalClient();
  const registerURL = await (client as ACClient).register(req, req.query);
  res.redirect(registerURL.toString());
};

/**
 * Creates createOrg logout using internal SDK and redirects to said URL.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>}
 */
const handleLogout = async (req: Request, res: Response): Promise<void> => {
  const client = getInternalClient();
  const logoutURL = await client.logout(req);
  res.redirect(logoutURL.toString());
};

/**
 * Handlers redirect from Kinde using internal SDK and redirects to siteURL,
 * if handling redirection fails, redirection is to unAuthorisedUrl.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>}
 */
const handleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { siteUrl } = getInitialConfig();
    const client = getInternalClient();
    const callbackURL = getRequestURL(req);
    await (client as ACClient).handleRedirectToApp(req, callbackURL);
    res.redirect(siteUrl);
  } catch (error) {
    const { unAuthorisedUrl } = getInitialConfig();
    res.redirect(unAuthorisedUrl);
  }
};

/**
 * Returns express Router with all the above handlers attached.
 *
 * @returns {import('express').Router}
 */
export const getAuthRouter = (): Router => {
  const redirectRoute = getRedirectRoute();
  const router = express.Router();
  router.get('/login', handleLogin);
  router.get('/logout', handleLogout);
  router.get('/register', handleRegister);
  router.get(redirectRoute, handleCallback);
  return router;
};
