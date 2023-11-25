import { default as  authUtils } from '@kinde-oss/kinde-node-auth-utils';
import { getInitialConfig, getInternalClient } from "../setup";
import { catchError } from "../utils";

const { authToken, getPem } = authUtils;

export const getUser = catchError(async req => {
  const kindeClient = getInternalClient();
  const userProfile = await kindeClient.getUserProfile(req);
  req.user = userProfile;
});

export const protectRoute = async (req, res, next) => {
  const { unAuthorisedUrl } = getInitialConfig();
  const kindeClient = getInternalClient();
  if (!await kindeClient.isAuthenticated(req)) {
    return res.status(403).redirect(unAuthorisedUrl);
  }

  const callbackFn = error => {
    if (error) return res.sendStatus(403);
    next();
  }

  const config = getInitialConfig();
  const pem = await getPem(config.issuerBaseUrl);
  const parsedToken = await kindeClient.getToken(req);
  authToken(parsedToken, pem, callbackFn);
};