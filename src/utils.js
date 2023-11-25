import crypto from 'crypto';

export const randomString = () => {
  return crypto.randomBytes(28).toString("hex");
}

export const getRequestURL = req => {
  const host = req.get('host');
  return new URL(`${req.protocol}://${host}${req.originalUrl}`);
}

export const catchError = middleware => {
  return (req, res, next) => {
    const onSuccess = () => next();
    const onFailure = error => next(error);
    middleware(req, res, next).then(onSuccess, onFailure);
  }
}

