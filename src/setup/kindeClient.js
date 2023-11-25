import { 
  GrantType, 
  createKindeServerClient 
} from "@kinde-oss/kinde-typescript-sdk";

import { 
  version as frameworkSDKVersion 
} from '../version';

let initialConfig;
let internalClient;

export const getInitialConfig = () => {
  if (initialConfig === undefined) {
    throw new Error('Initial config is not initialized');
  } else {
    return initialConfig;
  }
}

export const getInternalClient = () => {
  if (internalClient === undefined) {
    throw new Error('Internal Kinde server client is not initialized');
  } else {
    return internalClient;
  }
}

export const validateInitialConfig = config => {
  const {
    issuerBaseUrl,
    redirectUrl,
    siteUrl,
    secret,
    unAuthorisedUrl,
    clientId,
  } = config;

  if (!issuerBaseUrl) {
    throw new Error("Required config parameter 'issuerBaseUrl' is not provided");
  }

  if (!siteUrl) {
    throw new Error("Required config parameter 'siteUrl' is not provided");
  }

  if (!secret) {
    throw new Error("Required config parameter 'secret' is not provided");
  }

  if (!clientId) {
    throw new Error("Required config parameter 'clientId' is not provided");
  }

  if (!unAuthorisedUrl) {
    throw new Error("Required config parameter 'unAuthorisedUrl' is not provided");
  }

  if (!redirectUrl) {
    throw new Error("Required config parameter 'redirectUrl' is not provided");
  }

  return config;
}

export const setupInternalClient = (config) => {
  const {
    issuerBaseUrl,
    redirectUrl,
    siteUrl,
    secret,
    clientId,
  } = config;

  initialConfig = validateInitialConfig(config);
  internalClient = createKindeServerClient(
    GrantType.AUTHORIZATION_CODE,
    {
      authDomain: issuerBaseUrl,
      redirectURL: redirectUrl,
      clientId: clientId ?? 'reg@live',
      clientSecret: secret,
      logoutRedirectURL: siteUrl,
      scope: 'openid profile email',
      framework: 'ExpressJS',
      frameworkVersion: frameworkSDKVersion,
    }
  );

  return internalClient;
}
