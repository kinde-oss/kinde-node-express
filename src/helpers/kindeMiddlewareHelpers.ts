import { default as authUtils } from '@kinde-oss/kinde-node-auth-utils';
import { GrantType } from '@kinde-oss/kinde-typescript-sdk';
import { getInitialConfig, getInternalClient } from '../setup';
import { ExpressMiddleware } from '../utils';
import { JwtRsaVerifier } from 'aws-jwt-verify';
import type { Request, Response, NextFunction } from 'express';

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
  const kindeClient = getInternalClient();
  if (!(await kindeClient.isAuthenticated(req))) {
    const logoutURL = await kindeClient.logout(req);
    return res.redirect(logoutURL.toString());
  }

  const callbackFn = (error: Error) => {
    if (error) return res.sendStatus(403);
    next();
  };

  const config = getInitialConfig();
  const pem = await getPem(config.issuerBaseUrl);
  const parsedToken = await kindeClient.getToken(req);
  authToken(parsedToken, pem, callbackFn);
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
