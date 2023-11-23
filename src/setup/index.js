import { setupInternalClient } from "./kindeClient";
import { setupKindeSession } from "./sessionManager";

export { 
  getInternalClient,
  getInitialConfig,
} from "./kindeClient";

export const performInitialSetup = (app, config) => {
  setupKindeSession(app);
  setupInternalClient(config);
}
