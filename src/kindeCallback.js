const { AuthorizationCode } = require("simple-oauth2");

const kindeCallback = (credentials) => async (req, res, next) => {
  const { code, state } = req.query;
  const { kindeState } = req.session;
  const { issuerBaseUrl, siteUrl, secret, redirectUrl, unAuthorisedUrl } =
    credentials;

  if (kindeState === state) {
    const client = new AuthorizationCode({
      client: {
        id: clientId || "reg@live",
        secret: secret,
      },
      auth: {
        tokenHost: issuerBaseUrl,
        tokenPath: "/oauth2/token",
        authorizePath: "/oauth2/auth",
      },
    });
    try {
      const accessToken = await client.getToken(
        {
          code,
          redirect_uri: `${siteUrl}/kinde_callback`,
        },
        { json: true }
      );
      const token = accessToken.token;

      req.session.kindeAccessToken = JSON.stringify(token);
      req.session.kindeState = null;
      res.redirect(redirectUrl);
    } catch (err) {
      console.log(err);
      next();
    }
  } else {
    res.redirect(unAuthorisedUrl || redirectUrl);
  }
};

export { kindeCallback };
