import { setupKindeSession } from "./sessionManager";
import { setupInternalClient as setupKindeClient } from "./kindeClient";

export { 
  getInternalClient,
  getInitialConfig,
} from "./kindeClient";

export const setupInternalClient = (app, config) => {
  setupKindeSession(app);
  setupKindeClient(config);
}
