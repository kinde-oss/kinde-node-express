import type {
  GrantType,
  createKindeServerClient,
  PKCEClientOptions,
  ACClientOptions,
  CCClientOptions,
} from "@kinde-oss/kinde-typescript-sdk";

interface CommonSetupConfigParams<G extends GrantType> {
  grantType: G;
  issuerBaseUrl: string;
  postLogoutRedirectUrl: string;
  siteUrl: string;
  clientId: string;
  audience?: string;
  scope?: string;
}

interface ACSetupConfigParams
  extends CommonSetupConfigParams<GrantType.AUTHORIZATION_CODE> {
  secret: string;
  unAuthorisedUrl: string;
  redirectUrl: string;
}

interface PKCESetupConfigParams
  extends CommonSetupConfigParams<GrantType.PKCE> {
  unAuthorisedUrl: string;
  redirectUrl: string;
}

interface CCSetupConfigParams
  extends CommonSetupConfigParams<GrantType.CLIENT_CREDENTIALS> {
  secret: string;
}

export type ClientType<G extends GrantType> = ReturnType<
  typeof createKindeServerClient<G>
>;

export type SetupConfig<G> = G extends GrantType.PKCE
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
