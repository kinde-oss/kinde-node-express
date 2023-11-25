import { getInitialConfig, getInternalClient } from "../setup";
import { getRequestURL } from "../utils";
const express = require('express');

const handleLogin = async (req, res) => {
  const client = getInternalClient();
  const loginURL = await client.login(req);
  res.redirect(loginURL);
}

const handleRegister = async (req, res) => {
  const client = getInternalClient();
  const registerURL = await client.register(req);
  res.redirect(registerURL);
}

const handleCreateOrg = async(req, res) => {
  const client = getInternalClient();
  const createOrgURL = await client.createOrg(req);
  res.redirect(createOrgURL);
}

const handleLogout = async (req, res) => {
  const client = getInternalClient();
  const logoutURL = await client.logout(req);
  res.redirect(logoutURL);
}

const handleCallback = async (req, res) => {
  try {
    const { siteUrl } = getInitialConfig();
    const client = getInternalClient();
    const callbackURL = getRequestURL(req);
    await client.handleRedirectToApp(req, callbackURL);
    res.redirect(siteUrl);
  } catch (error) {
    const { unAuthorisedUrl } = getInitialConfig();
    res.redirect(unAuthorisedUrl);
  }
}

export const getAuthRouter = () => {
  const router = express.Router();
  router.get('/login', handleLogin);
  router.get('/logout', handleLogout);
  router.get('/register', handleRegister);
  router.get('/create_org', handleCreateOrg);
  router.get('/kinde_callback', handleCallback);
  return router;
}
