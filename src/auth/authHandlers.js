import { getInitialConfig, getInternalClient } from "../setup";
import { getRequestURL } from "../utils";

export const handleLogin = async (req, res) => {
  const client = getInternalClient();
  const loginURL = await client.login(req);
  res.redirect(loginURL);
}

export const handleRegister = async (req, res) => {
  const client = getInternalClient();
  const registerURL = await client.register(req);
  res.redirect(registerURL);
}

export const handleLogout = async (req, res) => {
  const client = getInternalClient();
  const logoutURL = await client.logout(req);
  res.redirect(logoutURL);
}

export const handleCallback = async (req, res) => {
  const { siteUrl } = getInitialConfig();
  const client = getInternalClient();
  const callbackURL = getRequestURL(req);
  await client.handleRedirectToApp(req, callbackURL);
  res.redirect(siteUrl);
}
