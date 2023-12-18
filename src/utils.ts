import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';

/**
 * @typedef {Function} ExpressMiddleware
 * @description This middleware logs information about the incoming request.
 * @param {import('express').Request} req - The Express request object.
 * @param {import('express').Response} res - The Express response object.
 * @param {import('express').NextFunction} next - The next middleware function in the stack.
 * @returns {T}
 */

export type ExpressMiddleware<T> = (
  req: Request,
  res: Response,
  next: NextFunction
) => T;

/**
 * Returns a randomly generated string, utilised for producing secret used for
 * singing session cookie.
 *
 * @returns {string}
 */
export const randomString = (): string => {
  return crypto.randomBytes(28).toString('hex');
};

/**
 * Returns the complete URL including host and any query parameters corresponding
 * to the provided request instance.
 *
 * @param {import('express').Request} req
 * @returns {URL}
 */
export const getRequestURL = (req: Request): URL => {
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
export const catchError = (
  handler: ExpressMiddleware<Promise<void>>
): ExpressMiddleware<void> => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const onSuccess = () => next();
    const onFailure = (error: Error) => next(error);
    handler(req, res, next).then(onSuccess, onFailure);
  };
};
