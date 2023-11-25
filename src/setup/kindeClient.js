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

export const setupInternalClient = (config) => {
  const {
    issuerBaseUrl,
    redirectUrl,
    siteUrl,
    secret,
    clientId,
  } = config;

  initialConfig = config;
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
