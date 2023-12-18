declare module '@kinde-oss/kinde-node-auth-utils' {
  const authToken: (
    parsedToken: string,
    pem: string,
    callback: (e: Error) => void
  ) => void;

  const getPem: (issuerBaseUrl: string) => Promise<string>;

  export { authToken, getPem };
}
