import { GrantType, createKindeServerClient } from '@kinde-oss/kinde-typescript-sdk';
import { version as frameworkSDKVersion } from '../version';

/**
 * @typedef {Object} SetupConfig
 * @property {import('@kinde-oss/kinde-typescript-sdk').GrantType} grantType
 * @property {string} issuerBaseUrl
 * @property {string} postLogoutRedirectUrl
 * @property {string} siteUrl
 * @property {string} clientId
 * @property {string | undefined} secret
 * @property {string | undefined} unAuthorisedUrl
 * @property {string | undefined} redirectUrl
 * @property {string | undefined} scope
 * @property {string | undefined} audience
 */

export type SetupConfig = {
  grantType: GrantType;
  issuerBaseUrl: string;
  redirectUrl: string;
  postLogoutRedirectUrl: string;
  siteUrl: string;
  secret: string;
  unAuthorisedUrl: string;
  clientId: string;
  scope?: string;
  audience?: string;
};

type ClientType = ReturnType<typeof createKindeServerClient>;

/**
 * @type{SetupConfig}
 */
let initialConfig: SetupConfig;

/**
 * @type{import('@kinde-oss/kinde-typescript-sdk').ACClient}
 */
let internalClient: ClientType;

/**
 * @type{string[]}
 */
const commonConfigParams: string[] = [
  'grantType',
  'issuerBaseUrl',
  'postLogoutRedirectUrl',
  'siteUrl',
  'clientId',
];

/**
 * @type{object}
 */
const grantTypeConfigParams: { [k: string]: string[] } = {
  [GrantType.CLIENT_CREDENTIALS]: ['secret'],
  [GrantType.AUTHORIZATION_CODE]: ['secret', 'redirectUrl', 'unAuthorisedUrl'],
  [GrantType.PKCE]: ['redirectUrl', 'unAuthorisedUrl'],
};

/**
 * Returns the above `initialConfig` private to this module, throws an exception if
 * said `initialConfig` has not been initialized.
 *
 * @returns {SetupConfig}
 */
export const getInitialConfig = (): SetupConfig => {
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
export const getInternalClient = (): typeof internalClient => {
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
export const validateInitialConfig = (config: SetupConfig): SetupConfig => {
  const grantTypeParams = grantTypeConfigParams[config.grantType];
  if (!grantTypeParams) {
    const types = Object.values(GrantType).join(', ');
    throw new Error(`Provided grant type must be one of ${types}`);
  }

  const configParams = [...commonConfigParams, ...grantTypeParams];
  configParams.forEach((param) => {
    const value = (config as Record<string, string>)[param];
    if (!value || typeof value !== 'string') {
      throw new Error(
        `Required config parameter '${param}' has invalid value ${value}`
      );
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
export const setupInternalClient = (config: SetupConfig): typeof internalClient => {
  const {
    issuerBaseUrl,
    redirectUrl,
    postLogoutRedirectUrl,
    audience,
    scope,
    secret,
    clientId,
  } = config;

  initialConfig = validateInitialConfig(config);
  internalClient = createKindeServerClient(initialConfig.grantType, {
    authDomain: issuerBaseUrl,
    redirectURL: redirectUrl,
    clientId: clientId ?? 'reg@live',
    clientSecret: secret,
    logoutRedirectURL: postLogoutRedirectUrl,
    audience: audience ?? undefined,
    scope: scope ?? 'openid profile email',
    framework: 'ExpressJS',
    frameworkVersion: frameworkSDKVersion,
  });

  return internalClient;
};
