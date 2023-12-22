import type { ACClient } from '@kinde-oss/kinde-typescript-sdk';
import type { Request, Response, NextFunction } from 'express';
import { validateQueryParams } from '../auth';
import { getInternalClient } from '../setup';

/**
 * Function uses internal SDK to return registration url with the `is_create_org`
 * query param set to true.
 *
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 * @returns {Promise<void>}
 */
export const createOrg = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const error = validateQueryParams(req.query);
  if (error !== null) {
    res.status(400);
    return next(error);
  }

  const { createOrg } = getInternalClient() as ACClient;
  const createOrgURL = await createOrg(req, req.query);
  res.redirect(createOrgURL.toString());
};
