import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";

/**
 * @typedef {Function} ExpressMiddleware
 * @description This middleware logs information about the incoming request.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {NextFunction} next - The next middleware function in the stack.
 * @returns {T}
 */

export type ExpressMiddleware<T> = (
  req: Request,
  res: Response,
  next: NextFunction,
) => T;

/**
 * Returns a randomly generated string, utilised for producing secret used for
 * singing session cookie.
 *
 * @returns {string}
 */
export const randomString = (): string => {
  return crypto.randomBytes(28).toString("hex");
};

/**
 * Returns the complete URL including host and any query parameters corresponding
 * to the provided request instance.
 *
 * @param {Request} req
 * @returns {URL}
 */
export const getRequestURL = (req: Request): URL => {
  const host = req.get("host");
  return new URL(`${req.protocol}://${host}${req.originalUrl}`);
};
