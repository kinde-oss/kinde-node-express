import type {
  GrantType,
  createKindeServerClient,
  PKCEClientOptions,
  ACClientOptions,
  CCClientOptions,
} from "@kinde-oss/kinde-typescript-sdk";

export interface CommonSetupConfigParams<G extends GrantType> {
  grantType: G;
  issuerBaseUrl: string;
  postLogoutRedirectUrl: string;
  siteUrl: string;
  clientId: string;
  audience?: string;
  scope?: string;
}

export interface ACSetupConfigParams
  extends CommonSetupConfigParams<GrantType.AUTHORIZATION_CODE> {
  secret: string;
  unAuthorisedUrl: string;
  redirectUrl: string;
}

export interface PKCESetupConfigParams
  extends CommonSetupConfigParams<GrantType.PKCE> {
  unAuthorisedUrl: string;
  redirectUrl: string;
}

export interface CCSetupConfigParams
  extends CommonSetupConfigParams<GrantType.CLIENT_CREDENTIALS> {
  secret: string;
}

export type ClientType<G extends GrantType> = ReturnType<
  typeof createKindeServerClient<G>
>;

export type SetupConfig<G extends GrantType> = G extends GrantType.PKCE
  ? PKCESetupConfigParams
  : G extends GrantType.AUTHORIZATION_CODE
    ? ACSetupConfigParams
    : G extends GrantType.CLIENT_CREDENTIALS
      ? CCSetupConfigParams
      : never;

export type ClientOptions<G> = G extends GrantType.PKCE
  ? PKCEClientOptions
  : G extends GrantType.AUTHORIZATION_CODE
    ? ACClientOptions
    : G extends GrantType.CLIENT_CREDENTIALS
      ? CCClientOptions
      : never;
