const kindeCallback = (client, urls) => async (req, res, next) => {
  const { code, state } = req.query;
  const { kindeState } = req.session;
  const { siteUrl, redirectUrl, unAuthorisedUrl } = urls;

  if (kindeState === state) {
    try {
      const accessToken = await client.getToken(
        {
          code,
          redirect_uri: `${siteUrl}/kinde_callback`,
          scope: "openid profile email",
        },
        { json: true }
      );
      const token = accessToken.token;
      req.session.kindeAccessToken = JSON.stringify(token);
      req.session.kindeState = null;
      res.redirect(redirectUrl);
    } catch (err) {
      console.log(err.message);
      next();
    }
  } else {
    res.redirect(unAuthorisedUrl || redirectUrl);
  }
};

export { kindeCallback };
