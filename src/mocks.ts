import { GrantType } from "@kinde-oss/kinde-typescript-sdk";
import { setupKinde } from "./index.js";
import express from "express";

export const mockClientConfig = {
  clientId: "mockclientid",
  secret: "mockclientsecret",
  grantType: GrantType.AUTHORIZATION_CODE,
  issuerBaseUrl: "https://mockdomain.kinde.com",
  siteUrl: "https://mockapp.com",
  unAuthorisedUrl: "https://mockapp.com/unauthorised",
  redirectUrl: "https://mockapp.com/kinde_callback",
  postLogoutRedirectUrl: "https://mockapp.com",
  scope: "openid profile email",
};

export const getMockAuthURL = (paramOverrides = {}) => {
  const authURL = new URL(`${mockClientConfig.issuerBaseUrl}/oauth2/auth`);
  const authURLSearchParams = new URLSearchParams({
    client_id: mockClientConfig.clientId,
    scope: mockClientConfig.scope,
    redirect_uri: mockClientConfig.redirectUrl,
    response_type: "code",
    state: "ec780ca2734867827259c63d24774eb5e557ebd695d00ce2d434fddc",
    ...paramOverrides,
  });
  authURL.search = authURLSearchParams.toString();
  return authURL;
};

export const setupKindeMock = (configOverrides = {}): express.Application => {
  const app = express();
  const config = { ...mockClientConfig, ...configOverrides };
  setupKinde(config, app);
  return app;
};
