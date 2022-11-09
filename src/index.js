const { AuthorizationCode } = require("simple-oauth2");
const { authToken, getPem } =
  require("@kinde-oss/kinde-node-auth-utils").default;
const axios = require("axios");
import { kindeCallback } from "./kindeCallback";
import { randomString } from "./utils/randomString";
const session = require("express-session");

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

let pem;
let unAuthorisedRedirectUrl;
let issuerUrl;

const setupKinde = async (credentials, app) => {
  app.use(
    session({
      secret: randomString(),
      saveUninitialized: true,
      cookie: { maxAge: oneDay },
      resave: false,
    })
  );

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

  const client = new AuthorizationCode({
    client: {
      id: clientId || "reg@live",
      secret: secret,
    },
    auth: {
      tokenHost: issuerUrl,
      tokenPath: "/oauth2/token",
      authorizePath: "/oauth2/auth",
    },
  });

  const url = new URL(
    client.authorizeURL({
      redirect_uri: `${siteUrl}/kinde_callback`,
      scope: "openid profile email",
    })
  );

  const loginUrl = url;
  const registerUrl = url;
  const logoutUrl = new URL(`${issuerUrl}/logout`);

  logoutUrl.search = new URLSearchParams({
    redirect: `${siteUrl}`,
  });

  app.get("/login", (req, res) => {
    const state = randomString();
    loginUrl.searchParams.set("state", state);
    req.session.kindeState = state;
    res.redirect(loginUrl.href);
  });

  app.get("/register", (req, res) => {
    const state = randomString();
    registerUrl.searchParams.set("state", state);
    registerUrl.searchParams.append("start_page", "registration");
    req.session.kindeState = state;
    res.redirect(registerUrl.href);
  });

  app.get("/logout", (req, res) => {
    req.session.destroy();
    res.redirect(logoutUrl.href);
  });

  app.get(
    "/kinde_callback",
    kindeCallback(client, { siteUrl, redirectUrl, unAuthorisedUrl })
  );
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
};
