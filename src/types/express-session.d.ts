import type { SessionData } from 'express-session';
import type { SessionManager, UserType } from '@kinde-oss/kinde-typescript-sdk';

declare module 'express-session' {
  interface SessionData {
    [key: string]: unknown;
  }
}

declare global {
  namespace Express {
    export interface Request extends SessionManager {
      user?: UserType;
      session: Session & Partial<SessionData>;
      sessionID: string;
    }
  }
}
