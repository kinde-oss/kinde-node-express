import { jwtVerify } from "./jwtVerifier";
import { setupKindeSession } from './sessionManager';

import {
  GrantType,
  createKindeServerClient
} from "@kinde-oss/kinde-typescript-sdk";

const {
  authToken,
  getPem
} = require("@kinde-oss/kinde-node-auth-utils").default;

let pem;
let unAuthorisedRedirectUrl;
let issuerUrl;
let kindeClient;

const setupKinde = async (credentials, app) => {
  setupKindeSession(app);

  const {
    issuerBaseUrl,
    redirectUrl,
    siteUrl,
    secret,
    unAuthorisedUrl,
    clientId,
  } = credentials;

  pem = await getPem(issuerBaseUrl);
  issuerUrl = issuerBaseUrl;
  unAuthorisedRedirectUrl = unAuthorisedUrl;

  const clientOptions = {
    authDomain: issuerBaseUrl,
    redirectURL: redirectUrl,
    clientId: clientId ?? 'reg@live',
    clientSecret: secret,
    logoutRedirectURL: siteUrl,
    scope: 'openid profile email',
  };

  kindeClient = createKindeServerClient(
    GrantType.AUTHORIZATION_CODE,
    clientOptions,
  );

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

const getUser = async (req, res, next) => {
  const { kindeAccessToken } = req.session;
  const parsedToken = kindeAccessToken && JSON.parse(kindeAccessToken);

  if (parsedToken) {
    try {
      const response = await axios.get(`${issuerUrl}/oauth2/v2/user_profile`, {
        headers: {
          Authorization: "Bearer " + parsedToken.access_token,
        },
      });

      req.user = response.data;
      return next();
    } catch (err) {
      console.log(err);
    }
  }
};

const protectRoute = (req, res, next) => {
  const { kindeAccessToken } = req.session;

  const parsedToken = kindeAccessToken && JSON.parse(kindeAccessToken);

  kindeAccessToken &&
    authToken(parsedToken.access_token, pem, (err, user) => {
      if (err) return res.sendStatus(403);
      const userObj = JSON.parse(user);
      req.user = { id: userObj.sub };
      next();
    });

  if (!kindeAccessToken) res.redirect(unAuthorisedRedirectUrl);
};

module.exports = {
  setupKinde,
  protectRoute,
  getUser,
  jwtVerify,
};
