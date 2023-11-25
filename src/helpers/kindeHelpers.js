import { getInternalClient } from '../setup';

export const getToken = async (req) => {
  return getInternalClient().getToken(req);
};

export const isAuthenticated = async (req) => {
  return getInternalClient().isAuthenticated(req);
};

export const getOrganization = async (req) => {
  return getInternalClient().getOrganization(req);
};

export const getUserOrganizations = async (req) => {
  return getInternalClient().getUserOrganizations(req);
};

export const getPermission = async (req, name) => {
  return getInternalClient().getPermission(req, name);
};

export const getPermissions = async (req) => {
  return getInternalClient().getPermissions(req);
};

export const getClaim = async (req, claim, type) => {
  return getInternalClient().getClaim(req, claim, type);
};

export const getClaimValue = async (req, claim, type) => {
  return getInternalClient().getClaimValue(req, claim, type);
};

export const getFlag = async (req, code, value, type) => {
  return getInternalClient().getFlag(req, code, value, type);
};

export const getIntegerFlag = async (req, code, value) => {
  return getInternalClient().getIntegerFlag(req, code, value);
};

export const getStringFlag = async (req, code, value) => {
  return getInternalClient().getStringFlag(req, code, value);
};

export const getBooleanFlag = async (req, code, value) => {
  return getInternalClient().getBooleanFlag(req, code, value);
};
