import {
  describe,
  it,
  expect,
  beforeEach,
} from 'vitest';
import express, {
  type Express,
} from 'express';
import request from 'supertest';
import session from 'express-session';
import { setupKindeSession } from './sessionManager.js';

describe('sessionManager', () => {
  let app: Express;

  beforeEach(() => {
    app = express();
    app.use(express.json());
  });

  describe('setupKindeSession()', () => {
    it('should add session middleware if it has not been added', () => {
      setupKindeSession(app);
      const sessionMiddleware = app._router.stack.find(
        (layer) => layer.name === 'session'
      );
      expect(sessionMiddleware).toBeDefined();
    });

    it('should not add session middleware if it has already been added', () => {
      app.use(
        session({
          secret:
            process.env.TEST_SESSION_SECRET || "test-secret-" + Date.now(),
          resave: false,
          saveUninitialized: true,
        })
      );
      const sessionMiddlewareCount = app._router.stack.filter(
        (layer) => layer.name === 'session'
      ).length;
      expect(sessionMiddlewareCount).toBe(1);
      setupKindeSession(app);
      const sessionMiddlewareCountAfter = app._router.stack.filter(
        (layer) => layer.name === 'session'
      ).length;
      expect(sessionMiddlewareCountAfter).toBe(1);
    });

    it('should add getSessionManager middleware', () => {
      const initialStackLength = app._router.stack.length;
      setupKindeSession(app);
      const finalStackLength = app._router.stack.length;
      expect(finalStackLength).toBeGreaterThan(initialStackLength);
    });
  });

  describe('ExpressSessionManager functionality', () => {
    beforeEach(() => {
      setupKindeSession(app);
      app.get('/session-functions', (req, res) => {
        res.json({
          setSessionItem: typeof req.setSessionItem === 'function',
          getSessionItem: typeof req.getSessionItem === 'function',
          removeSessionItem: typeof req.removeSessionItem === 'function',
          destroySession: typeof req.destroySession === 'function',
        });
      });

      app.post('/set-item', async (req, res) => {
        const { key, value } = req.body;
        await req.setSessionItem(key, value);
        res.sendStatus(200);
      });

      app.get('/get-item', async (req, res) => {
        const { key } = req.query;
        const value = await req.getSessionItem(key as string);
        res.json({ value });
      });

      app.post('/remove-item', async (req, res) => {
        const { key } = req.body;
        await req.removeSessionItem(key);
        res.sendStatus(200);
      });

      app.post('/destroy', async (req, res) => {
        try {
          await req.destroySession();
          res.sendStatus(200);
        } catch {
          res.status(500).send('Error destroying session');
        }
      });
    });

    it('adds ExpressSessionManager methods to the request object', async () => {
      const res = await request(app).get('/session-functions');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({
        setSessionItem: true,
        getSessionItem: true,
        removeSessionItem: true,
        destroySession: true,
      });
    });

    it('sets and gets a session item via ExpressSessionManager', async () => {
      const agent = request.agent(app);
      await agent
        .post('/set-item')
        .send({ key: 'testKey', value: 'testValue' });
      const res = await agent.get('/get-item').query({ key: 'testKey' });
      expect(res.body.value).toBe('testValue');
    });

    it('removes a session item via ExpressSessionManager', async () => {
      const agent = request.agent(app);
      await agent
        .post('/set-item')
        .send({ key: 'testKey', value: 'testValue' });
      await agent.post('/remove-item').send({ key: 'testKey' });
      const res = await agent.get('/get-item').query({ key: 'testKey' });
      expect(res.body.value).toBe(null);
    });

    it('destroys the session via ExpressSessionManager', async () => {
      const agent = request.agent(app);
      await agent
        .post('/set-item')
        .send({ key: 'testKey', value: 'testValue' });
      await agent.post('/destroy');
      const res = await agent.get('/get-item').query({ key: 'testKey' });
      expect(res.body.value).toBe(null);
    });
  });
});
