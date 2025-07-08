// this file only re-exports the necessary functions and types from the other files
// in the setup directory
export {
  getInternalClient,
  getInitialConfig,
  setupInternalClient,
} from "./kindeClient.js";

export { getSessionManager, setupKindeSession } from "./sessionManager.js";
export * from "./kindeSetupTypes.js";
