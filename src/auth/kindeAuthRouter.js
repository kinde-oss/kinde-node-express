import { getInitialConfig, getInternalClient } from '../setup';
import { getRequestURL } from '../utils';
import express from 'express';

/**
 * Validates request query parameters for login, regsister and createOrg URLs.
 * 
 * @param {object} requestQuery
 */
export const validateQueryParams = (requestQuery) => {
  const queryParams = ['org_name', 'org_code'];
  queryParams.forEach(param => {
    const value = requestQuery[param];
    if (value !== undefined) {
      if (!value || typeof value !== 'string') {
        throw new Error(`Provided param '${param}' has invalid value '${value}'`);
      }
    }
  });
};

/**
 * Creates login URL using internal SDK and redirects to said URL.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>}
 */
const handleLogin = async (req, res) => {
  validateQueryParams(req.query);
  const client = getInternalClient();
  const loginURL = await client.login(req, req.query);
  res.redirect(loginURL);
};

/**
 * Creates register URL using internal SDK and redirects to said URL.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>}
 */
const handleRegister = async (req, res) => {
  validateQueryParams(req.query);
  const client = getInternalClient();
  const registerURL = await client.register(req, req.query);
  res.redirect(registerURL);
};

/**
 * Creates createOrg logout using internal SDK and redirects to said URL.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>}
 */
const handleLogout = async (req, res) => {
  const client = getInternalClient();
  const logoutURL = await client.logout(req);
  res.redirect(logoutURL);
};

/**
 * Handlers redirect from Kinde using internal SDK and redirects to siteURL,
 * if handling redirection fails, redirection is to unAuthorisedUrl.
 *
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {Promise<void>}
 */
const handleCallback = async (req, res) => {
  try {
    const { siteUrl } = getInitialConfig();
    const client = getInternalClient();
    const callbackURL = getRequestURL(req);
    await client.handleRedirectToApp(req, callbackURL);
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
export const getAuthRouter = () => {
  const router = express.Router();
  router.get('/login', handleLogin);
  router.get('/logout', handleLogout);
  router.get('/register', handleRegister);
  router.get('/kinde_callback', handleCallback);
  return router;
};
