import { default as authUtils } from '@kinde-oss/kinde-node-auth-utils';
import { getInitialConfig, getInternalClient } from '../setup';
import { catchError } from '../utils';

const { authToken, getPem } = authUtils;

/**
 * Custom middleware fetches details for the authenticated user and attaches them
 * to the request object, available as `req.user` and having the following type
 * @type{import('@kinde-oss/kinde-typescript-sdk').UserType}.
 *
 * @param{import('../utils').ExpressHandler}
 */
export const getUser = catchError(async (req) => {
  const kindeClient = getInternalClient();
  const userProfile = await kindeClient.getUserProfile(req);
  req.user = userProfile;
});

/**
 * Custom middleware determines if the user is authenticated or not if so proceeds
 * to next middleware otherwise redirects to `unAuthorisedUrl` with 403 staus.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {Promise<void>}
 */
export const protectRoute = async (req, res, next) => {
  const { unAuthorisedUrl } = getInitialConfig();
  const kindeClient = getInternalClient();
  if (!(await kindeClient.isAuthenticated(req))) {
    return res.status(403).redirect(unAuthorisedUrl);
  }

  const callbackFn = (error) => {
    if (error) return res.sendStatus(403);
    next();
  };

  const config = getInitialConfig();
  const pem = await getPem(config.issuerBaseUrl);
  const parsedToken = await kindeClient.getToken(req);
  authToken(parsedToken, pem, callbackFn);
};
