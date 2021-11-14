import { contextBridge, ipcRenderer, OpenDialogOptions } from 'electron';
import { $FileSystem } from '../src/utils/FileSystem';

export const api = {
  /**
   * Log in the terminal.
   */
  log: (message: string) => {
    ipcRenderer.send('message', message);
  },

  /**
   * Provide an easier way to listen to events.
   */
  on: (channel: string, callback: Function) => {
    ipcRenderer.on(channel, (_, data) => {
      console.log('listening to', channel);
      callback(data);
    });
  },

  /**
   * Expose filesystem library.
   */
  $FileSystem,

  /**
   * Native dialogs.
   */
  openDialog: (options: OpenDialogOptions): string[] | undefined => {
    return ipcRenderer.sendSync('open-dialog', options);
  },
};

contextBridge.exposeInMainWorld('api', api);
