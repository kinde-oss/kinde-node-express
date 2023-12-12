import { validateQueryParams } from '../auth';
import { getInternalClient } from '../setup';

/**
 * Function returns unparsed (raw) kinde access token for current user,
 * will through exception if current user is not authenticated.
 * 
 * @param {import('express').Request} req
 * @returns {Promise<string>}
 */
export const getToken = async (req) => {
  return getInternalClient().getToken(req);
};

/**
 * Function returns boolean indicating if current user is authenticated or not.
 * 
 * @param {import('express').Request} req
 * @returns {Promise<boolean>}
 */
export const isAuthenticated = async (req) => {
  return getInternalClient().isAuthenticated(req);
};

/**
 * Function fetches details for current user's information, raises exception if 
 * current user is not authenticated. 
 * 
 * @param {import('express').Request} req 
 * @returns {Promise<import('@kinde-oss/kinde-typescript-sdk').UserType}
 */
export const getUserDetails = async (req) => {
  return getInternalClient().getUser(req);
}

/**
 * Function uses internal SDK to return registration url with the `is_create_org`
 * query param set to true.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @returns {Promise<URL>} required createOrg authorization URL
 */
export const createOrg = async (req, res) => {
  validateQueryParams(req.query);
  const { createOrg } = getInternalClient();
  const createOrgURL = await createOrg(req, req.query);
  res.redirect(createOrgURL);
};

/**
 * Function returns organization code, in which authenticated user is currently
 * signed into, throws exception if user is not authenticated.
 * 
 * @param {import('express').Request} req
 * @returns {Promise<{ orgCode: string | null }>}
 */
export const getOrganization = async (req) => {
  return getInternalClient().getOrganization(req);
};

/**
 * Function returns all organizations to which current user belongs, throws 
 * exception if user is not authenticated.
 * 
 * @param {import('express').Request} req
 * @returns {Promise<{ orgCodes: string[] }>}
 */
export const getUserOrganizations = async (req) => {
  return getInternalClient().getUserOrganizations(req);
};

/**
 * Function returns response indicating if current user has been provided 
 * with given permission in currently signed in organization, throws exception 
 * if user is not authenticated.
 * 
 * @param {import('express').Request} req
 * @param {string} name 
 * @returns {Promise<{ orgCode: string | null, isGranted: boolean }>}
 */
export const getPermission = async (req, name) => {
  return getInternalClient().getPermission(req, name);
};

/**
 * Function returns all permissions granted to user in current organization, 
 * throws exception if user is not authenticated.
 * 
 * @param {import('express').Request} req
 * @returns {Promise<{ orgCode: string | null, permissions: string[] }>}
 */
export const getPermissions = async (req) => {
  return getInternalClient().getPermissions(req);
};

/**
 * Function returns name and value of provided claim in access token, throws 
 * exception if user is not authenticated.
 * 
 * @param {import('express').Request} req
 * @param {string} claim 
 * @param {import('@kinde-oss/kinde-typescript-sdk').ClaimTokenType | undefined} type 
 * @returns {Promise<{ name: string, value: unknown }>}
 */
export const getClaim = async (req, claim, type) => {
  return getInternalClient().getClaim(req, claim, type);
};

/**
 * Function returns value of provided claim in access token, throws exception
 * if user is not authenticated.
 * 
 * @param {import('express').Request} req
 * @param {string} claim 
 * @param {import('@kinde-oss/kinde-typescript-sdk').ClaimTokenType | undefined} type 
 * @returns {Promise<unknown>}
 */
export const getClaimValue = async (req, claim, type) => {
  return getInternalClient().getClaimValue(req, claim, type);
};

/**
 * Function returns flag corresponding to provided code, throws exceptionl is user
 * is not authenticated, if claim does not exist and no default value is provided 
 * or if the provided type does not match the actual type of the flag's value.
 * 
 * @param {import('express').Request} req
 * @param {string} code - claim code
 * @param {string | number | boolean | undefined} value - claim default value
 * @param {keyof import('@kinde-oss/kinde-typescript-sdk').FlagType | undefined} type - expected type
 * @returns {Promise<import('@kinde-oss/kinde-typescript-sdk').GetFlagType>}
 */
export const getFlag = async (req, code, value, type) => {
  return getInternalClient().getFlag(req, code, value, type);
};

/**
 * Function returns integer flag corresponding code, it is essentially a wrapper
 * around getFlag function exported by this package.
 * 
 * @param {import('express').Request} req
 * @param {string} code - claim code 
 * @param {number | undefined} value - claim default value
 * @returns {Promise<number>}
 */
export const getIntegerFlag = async (req, code, value) => {
  return getInternalClient().getIntegerFlag(req, code, value);
};

/**
 * Function returns string flag corresponding code, it is essentially a wrapper
 * around getFlag function exported by this package.
 * 
 * @param {import('express').Request} req
 * @param {string} code - claim code 
 * @param {string | undefined} value - claim default value
 * @returns {Promise<string>}
 */
export const getStringFlag = async (req, code, value) => {
  return getInternalClient().getStringFlag(req, code, value);
};

/**
 * Function returns boolean flag corresponding code, it is essentially a wrapper
 * around getFlag function exported by this package.
 * 
 * @param {import('express').Request} req
 * @param {string} code - claim code 
 * @param {boolean | undefined} value - claim default value
 * @returns {Promise<boolean>}
 */
export const getBooleanFlag = async (req, code, value) => {
  return getInternalClient().getBooleanFlag(req, code, value);
};
