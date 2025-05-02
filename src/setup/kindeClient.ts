import {
  GrantType,
  createKindeServerClient,
} from "@kinde-oss/kinde-typescript-sdk";
import type {
  SetupConfig,
  ClientType,
  ClientOptions,
} from "./kindeSetupTypes.js";
import { version as frameworkSDKVersion } from "../version.js";

let initialConfig: SetupConfig<GrantType>;
let internalClient: ClientType<GrantType>;

const commonConfigParams: string[] = [
  "grantType",
  "issuerBaseUrl",
  "postLogoutRedirectUrl",
  "siteUrl",
  "clientId",
] as const;

const grantTypeConfigParams: {
  [k in GrantType]: string[];
} = {
  [GrantType.AUTHORIZATION_CODE]: ["secret", "redirectUrl", "unAuthorisedUrl"],
  [GrantType.PKCE]: ["redirectUrl", "unAuthorisedUrl"],
  [GrantType.CLIENT_CREDENTIALS]: ["secret"],
};

/**
 * Returns the above `initialConfig` private to this module, throws an exception if
 * said `initialConfig` has not been initialized.
 *
 * @returns {SetupConfig}
 */
export const getInitialConfig = <G extends GrantType>(): SetupConfig<G> => {
  if (initialConfig === undefined) {
    throw new Error("Initial config is not initialized");
  } else {
    return initialConfig as SetupConfig<G>;
  }
};

/**
 * Returns the above `internalClient` private to this module, throws an exception if
 * said `internalClient` has not been initialized.
 *
 * @returns {ClientType<G>}
 */
export const getInternalClient = <G extends GrantType>(): ClientType<G> => {
  if (internalClient === undefined) {
    throw new Error("Internal Kinde server client is not initialized");
  } else {
    return internalClient as ClientType<G>;
  }
};

/**
 * Validates provided config, raises exception if any required parameters are
 * missing otherwise returns same config.
 *
 * @param {SetupConfig<G>} config
 * @returns {SetupConfig<G>}
 */
export const validateInitialConfig = <G extends GrantType>(
  config: SetupConfig<G>,
): SetupConfig<G> => {
  const grantType: GrantType = config.grantType;
  const grantTypeParams = grantTypeConfigParams[grantType];
  if (!grantTypeParams) {
    const types = Object.values(GrantType).join(", ");
    throw new Error(`Provided grant type must be one of these values ${types}`);
  }

  const configParams = [...commonConfigParams, ...grantTypeParams];
  const configObject = config as unknown as Record<string, string>;
  configParams.forEach((param) => {
    const value = configObject[param];
    if (!value || typeof value !== "string") {
      throw new Error(
        `Required config parameter '${param}' has invalid value ${value}`,
      );
    }
  });

  return config;
};

/**
 * Initializes above `initialConfig` and `internalClient` raises an exception if
 * validation of provided config failes, returns created client otherwise.
 *
 * @param {SetupConfig<G>} config
 * @returns {ClientType<G>}
 */
export const setupInternalClient = <G extends GrantType>(
  config: SetupConfig<G>,
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
      clientId: clientId ?? "reg@live",
      clientSecret: secret,
      logoutRedirectURL: postLogoutRedirectUrl,
      audience: audience ?? undefined,
      scope: scope ?? undefined,
      framework: "ExpressJS",
      frameworkVersion: frameworkSDKVersion,
    } as ClientOptions<G>,
  );

  return internalClient as ClientType<G>;
};
