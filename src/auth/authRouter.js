import * as handlers from './authHandlers';
const express = require('express');

export const getAuthRouter = () => {
  const router = express.Router();
  router.get('/login', handlers.handleLogin);
  router.get('/logout', handlers.handleLogout);
  router.get('/register', handlers.handleRegister);
  router.get('/create_org', handlers.handleCreateOrg);
  router.get('/kinde_callback', handlers.handleCallback);
  return router;
}
