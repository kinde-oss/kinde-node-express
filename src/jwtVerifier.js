import { JwtRsaVerifier } from "aws-jwt-verify";

const jwtVerify = (issuer, options = {}) => {
  const { audience } = options;
  const verifier = JwtRsaVerifier.create({
    issuer,
    audience: audience || null,
    jwksUri: `${issuer}/.well-known/jwks.json`,
  });

  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader && authHeader.split(" ")[1];
      const payload = await verifier.verify(token);
      console.log("Token is valid");
      req.user = { id: payload.sub };
      next();
    } catch (err) {
      console.log("Token not valid!");
      console.log(err);
      return res.sendStatus(403);
    }
  };
};

export { jwtVerify };
