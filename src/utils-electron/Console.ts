import { ipcRenderer } from 'electron';

export const $Console = {
  log: (message: string) => {
    ipcRenderer.send('Console.log', message);
  },
};
