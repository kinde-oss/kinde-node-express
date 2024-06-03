import { default as authUtils } from '@kinde-oss/kinde-node-auth-utils';
import { GrantType } from '@kinde-oss/kinde-typescript-sdk';
import { getInitialConfig, getInternalClient } from '../setup/index.js';
import type { ExpressMiddleware } from '../utils.js';
import { JwtRsaVerifier } from 'aws-jwt-verify';
import type { Request, Response, NextFunction } from 'express';
import { validateToken, type jwtValidationResponse } from '@kinde/jwt-validator';

const { authToken, getPem } = authUtils;

/**
 * Custom middleware fetches details for the authenticated user and attaches them
 * to the request object, available as `req.user` and having the following type
 * @type {UserType}.
 *
 * @param {Request}
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const kindeClient = getInternalClient<GrantType.PKCE>();
  if (!(await kindeClient.isAuthenticated(req))) {
    const logoutURL = await kindeClient.logout(req);
    return res.redirect(logoutURL.toString());
  }

  try {
    const userProfile = await kindeClient.getUserProfile(req);
    req.user = userProfile;
    return next();
  } catch (error) {
    return next(error);
  }
};

/**
 * Custom middleware determines if the user is authenticated or not if so proceeds
 * to next middleware otherwise redirects to `unAuthorisedUrl` with 403 staus.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const protectRoute = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { isAuthenticated, logout, getToken } = getInternalClient();
  const { issuerBaseUrl } = getInitialConfig();

  if (req.headers.authorization) {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.sendStatus(401); // Unauthorized
      return;
    }
    const token = authHeader.split(' ')[1];
    const validationResult: jwtValidationResponse = await validateToken({
      token,
      domain: issuerBaseUrl,
    });

    if (validationResult.valid) {
      req.setSessionItem('access_token', token);
      next();
    } else {
      res.sendStatus(403);
      return;
    }
  }

  if (!(await isAuthenticated(req))) {
    const logoutURL = await logout(req);
    return res.redirect(logoutURL.toString());
  }
  const token = await getToken(req);

  const callbackFn = (error: Error) => {
    if (error) return res.sendStatus(403);
    next();
  };

  const pem = await getPem(issuerBaseUrl);

  authToken(token, pem, callbackFn);
};

/**
 * Custom JWT verifier as middleware, for verifying integrity of JWT bearer
 * tokens in authorization headers.
 *
 * @param {string} issuer - issuerBaseUrl
 * @param {Record<string, string>}
 * @returns {ExpressMiddleware<Promise<void>>}
 */
export const jwtVerify = (
  issuer: string,
  options: Record<string, string>
): ExpressMiddleware<Promise<void | Response>> => {
  const { audience } = options;
  const verifier = JwtRsaVerifier.create({
    issuer,
    audience: audience || null,
    jwksUri: `${issuer}/.well-known/jwks.json`,
  });

  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(' ')[1];
      const payload = await verifier.verify(token);
      // @ts-expect-error, preserving this behaviour owing to backward compatibility.
      req.user = { id: payload.sub };
      next();
    } catch (err) {
      console.log('Token not valid!');
      console.log(err);
      return res.sendStatus(403);
    }
  };
};
