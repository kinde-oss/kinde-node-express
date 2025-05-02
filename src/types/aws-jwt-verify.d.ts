declare module "aws-jwt-verify" {
  type VerifierOptions = {
    issuer: string;
    audience: string | null;
    jwksUri: string;
  };

  type Verifier = {
    verify(token?: string): Promise<{ sub: string }>;
  };

  const JwtRsaVerifier: {
    create(options: VerifierOptions): Verifier;
  };

  export { JwtRsaVerifier };
}
