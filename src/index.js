import { jwtVerify } from "./jwtVerifier";
import { getInternalClient, performInitialSetup } from './setup';
import { setupAuthRouter } from './auth';

const {
  authToken,
  getPem
} = require("@kinde-oss/kinde-node-auth-utils").default;

let pem;

const setupKinde = async (credentials, app) => {
  performInitialSetup(app, credentials);
  setupAuthRouter(app, '/');
  const { issuerBaseUrl } = credentials;
  pem = await getPem(issuerBaseUrl);
};

const getUser = async (req, _, next) => { 
  try {
    const kindeClient = getInternalClient();
    const userProfile = await kindeClient.getUserProfile(req);
    req.user = userProfile;
    next();
  } catch (error) {
    next(error);
  }
};

const protectRoute = async (req, res, next) => {
  const kindeClient = getInternalClient();
  if (!await kindeClient.isAuthenticated(req)) {
    return res.sendStatus(403);
  }

  const callback = (error) => {
    if (error) return res.sendStatus(403);
    next();
  }

  const parsedToken = await kindeClient.getToken(req);
  authToken(parsedToken, pem, callback);
};

module.exports = {
  setupKinde,
  protectRoute,
  getUser,
  jwtVerify,
};
