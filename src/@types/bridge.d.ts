import { api } from '../../electron/bridge';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    api: typeof api;
  }
}
