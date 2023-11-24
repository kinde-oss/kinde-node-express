const crypto = require("crypto");

export const randomString = () => {
  return crypto.randomBytes(28).toString("hex");
}

export const getRequestURL = req => {
  const host = req.get('host');
  return new URL(`${req.protocol}://${host}${req.originalUrl}`);
}

