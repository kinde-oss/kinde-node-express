declare module "express-session" {
  interface SessionData {
    [key: string]: unknown;
  }
}
declare global {
  namespace Express {
    interface Request {
      session?: {
        [key: string]: unknown;
        destroy: (callback: (err?: Error | null) => void) => void;
      };
      setSessionItem?: (itemKey: string, itemValue: unknown) => Promise<void>;
      getSessionItem?: (itemKey: string) => Promise<unknown>;
      removeSessionItem?: (itemKey: string) => Promise<void>;
      destroySession?: () => void;
    }
  }
}

export {};
