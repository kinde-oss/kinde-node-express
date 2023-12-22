import { GrantType, createKindeServerClient } from '@kinde-oss/kinde-typescript-sdk';
import { SetupConfig, ClientType, ClientOptions } from './kindeSetupTypes';
import { version as frameworkSDKVersion } from '../version';

/**
 * @type{SetupConfig}
 */
let initialConfig: SetupConfig<GrantType>;

/**
 * @type{import('@kinde-oss/kinde-typescript-sdk').ACClient}
 */
let internalClient: ClientType<GrantType>;

/**
 * @type{string[]}
 */
const commonConfigParams: string[] = [
  'grantType',
  'issuerBaseUrl',
  'postLogoutRedirectUrl',
  'siteUrl',
  'clientId',
] as const;

/**
 * @type{object}
 */
const grantTypeConfigParams: {
  [k in GrantType]: string[];
} = {
  [GrantType.AUTHORIZATION_CODE]: ['secret', 'redirectUrl', 'unAuthorisedUrl'],
  [GrantType.PKCE]: ['redirectUrl', 'unAuthorisedUrl'],
  [GrantType.CLIENT_CREDENTIALS]: ['secret'],
};

/**
 * Returns the above `initialConfig` private to this module, throws an exception if
 * said `initialConfig` has not been initialized.
 *
 * @returns {SetupConfig}
 */
export const getInitialConfig = <G extends GrantType>(): SetupConfig<G> => {
  if (initialConfig === undefined) {
    throw new Error('Initial config is not initialized');
  } else {
    return initialConfig as SetupConfig<G>;
  }
};

/**
 * Returns the above `internalClient` private to this module, throws an exception if
 * said `internalClient` has not been initialized.
 *
 * @returns{import('@kinde-oss/kinde-typescript-sdk').ACClient}
 */
export const getInternalClient = <G extends GrantType>(): ClientType<G> => {
  if (internalClient === undefined) {
    throw new Error('Internal Kinde server client is not initialized');
  } else {
    return internalClient as ClientType<G>;
  }
};

/**
 * Validates provided config, raises exception if any required parameters are
 * missing otherwise returns same config.
 *
 * @param {SetupConfig} config
 * @returns {SetupConfig}
 */
export const validateInitialConfig = <G extends GrantType>(
  config: SetupConfig<G>
): SetupConfig<G> => {
  const grantTypeParams = grantTypeConfigParams[config.grantType as GrantType];
  if (!grantTypeParams) {
    const types = Object.values(GrantType).join(', ');
    throw new Error(`Provided grant type must be one of ${types}`);
  }

  const configParams = [...commonConfigParams, ...grantTypeParams];
  configParams.forEach((param) => {
    const value = (config as unknown as Record<string, string>)[param];
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
export const setupInternalClient = <G extends GrantType>(
  config: SetupConfig<G>
): ClientType<G> => {
  const {
    issuerBaseUrl,
    redirectUrl,
    postLogoutRedirectUrl,
    audience,
    scope,
    secret,
    clientId,
  } = config as unknown as Record<string, string>;

  initialConfig = validateInitialConfig(config);
  internalClient = createKindeServerClient<G>(
    initialConfig.grantType as G,
    {
      authDomain: issuerBaseUrl,
      redirectURL: redirectUrl,
      clientId: clientId ?? 'reg@live',
      clientSecret: secret,
      logoutRedirectURL: postLogoutRedirectUrl,
      audience: audience ?? undefined,
      scope: scope ?? 'openid profile email',
      framework: 'ExpressJS',
      frameworkVersion: frameworkSDKVersion,
    } as ClientOptions<G>
  );

  return internalClient as ClientType<G>;
};
