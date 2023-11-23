import { jwtVerify } from "./jwtVerifier";
import { getInternalClient, performInitialSetup } from './setup';

const {
  authToken,
  getPem
} = require("@kinde-oss/kinde-node-auth-utils").default;

let pem;

const setupKinde = async (credentials, app) => {
  performInitialSetup(app, credentials);

  const { issuerBaseUrl, siteUrl } = credentials;
  pem = await getPem(issuerBaseUrl);
  const kindeClient = getInternalClient();

  app.get("/login", async (req, res) => {
    const loginURL = await kindeClient.login(req);
    res.redirect(loginURL);
  });

  app.get("/register", async (req, res) => {
    const registerURL = await kindeClient.register(req);
    res.redirect(registerURL);
  });

  app.get("/logout", async (req, res) => {
    const logoutURL = await kindeClient.logout(req);
    console.log(logoutURL.toString());
    res.redirect(logoutURL);
  });

  app.get("/kinde_callback", async (req, res) => {
    const host = req.get('host');
    const completeURL = `${req.protocol}://${host}${req.originalUrl}`;
    const callbackURL = new URL(completeURL);
    await kindeClient.handleRedirectToApp(req, callbackURL);
    res.redirect(siteUrl);
  });
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
