import { GrantType, createKindeServerClient } from '@kinde-oss/kinde-typescript-sdk';
import { version as frameworkSDKVersion } from '../version';

/**
 * @typedef {Object} SetupConfig
 * @property {string} issuerBaseUrl
 * @property {string} redirectUrl
 * @property {string} siteUrl
 * @property {string} secret
 * @property {string} unAuthorisedUrl
 * @property {string} clientId
 * @property {string | undefined} scope
 * @property {string | undefined} audience
 * /

/**
 * @type{SetupConfig}
 */
let initialConfig;

/**
 * @type{import('@kinde-oss/kinde-typescript-sdk').ACClient}
 */
let internalClient;

/**
 * Returns the above `initialConfig` private to this module, throws an exception if
 * said `initialConfig` has not been initialized.
 *
 * @returns {SetupConfig}
 */
export const getInitialConfig = () => {
  if (initialConfig === undefined) {
    throw new Error('Initial config is not initialized');
  } else {
    return initialConfig;
  }
};

/**
 * Returns the above `internalClient` private to this module, throws an exception if
 * said `internalClient` has not been initialized.
 *
 * @returns{import('@kinde-oss/kinde-typescript-sdk').ACClient}
 */
export const getInternalClient = () => {
  if (internalClient === undefined) {
    throw new Error('Internal Kinde server client is not initialized');
  } else {
    return internalClient;
  }
};

/**
 * Validates provided config, raises exception if any required parameters are
 * missing otherwise returns same config.
 *
 * @param {SetupConfig} config
 * @returns {SetupConfig}
 */
export const validateInitialConfig = (config) => {
  const configParams = [
    'issuerBaseUrl',
    'redirectUrl',
    'siteUrl',
    'secret',
    'unAuthorisedUrl',
    'clientId',
  ];

  configParams.forEach(param => {
    const value = config[param];
    if (!value || typeof value !== 'string') {
      throw new Error(`Required config parameter '${param}' has invalid value ${value}`);
    }
  });

  return config;
};

/**
 * Initializes above `initialConfig` and `internalClient` raises an exception if
 * validation of provided config failes, returns created client otherwise.
 *
 * @param {SetupConfig} config
 * @returns{import('@kinde-oss/kinde-typescript-sdk').ACClient}
 */
export const setupInternalClient = (config) => {
  const { issuerBaseUrl, redirectUrl, siteUrl, audience, scope, secret, clientId } = config;

  initialConfig = validateInitialConfig(config);
  internalClient = createKindeServerClient(GrantType.AUTHORIZATION_CODE, {
    authDomain: issuerBaseUrl,
    redirectURL: redirectUrl,
    clientId: clientId ?? 'reg@live',
    clientSecret: secret,
    logoutRedirectURL: siteUrl,
    audience: audience ?? undefined,
    scope: scope ?? 'openid profile email',
    framework: 'ExpressJS',
    frameworkVersion: frameworkSDKVersion,
  });

  return internalClient;
};
