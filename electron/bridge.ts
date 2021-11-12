import { contextBridge, ipcRenderer } from 'electron';
import fs from 'fs';

export const api = {
  /**
   * Here you can expose functions to the renderer process so they can interact
   * with the main (electron) side without security problems.
   *
   * The function below can accessed using `window.Main.sendMessage`.
   */

  log: (message: string) => {
    ipcRenderer.send('message', message);
  },

  /**
   * Provide an easier way to listen to events.
   */
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  },

  /**
   * Expose filesystem library.
   */
  fs,
};

contextBridge.exposeInMainWorld('api', api);
