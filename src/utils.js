import crypto from 'crypto';

/**
 * @typedef {Function} ExpressMiddleware
 * @description This middleware logs information about the incoming request.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {void}
 */

/**
 * @typedef {Function} ExpressHandler
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @returns {void}
 */

/**
 * Returns a randomly generated string, utilised for producing secret used for
 * singing session cookie.
 *
 * @returns {string}
 */
export const randomString = () => {
  return crypto.randomBytes(28).toString('hex');
};

/**
 * Returns the complete URL including host and any query parameters corresponding
 * to the provided request instance.
 *
 * @param {import('express').Request} req
 * @returns {URL}
 */
export const getRequestURL = (req) => {
  const host = req.get('host');
  return new URL(`${req.protocol}://${host}${req.originalUrl}`);
};

/**
 * Executes provided express handler if exception occurs passes error to next
 * otherwise proceeds to next middleware.
 *
 * @param {ExpressMiddleware} handler
 * @returns {ExpressMiddleware}
 */
export const catchError = (handler) => {
  return (req, res, next) => {
    const onSuccess = () => next();
    const onFailure = (error) => next(error);
    handler(req, res, next).then(onSuccess, onFailure);
  };
};
