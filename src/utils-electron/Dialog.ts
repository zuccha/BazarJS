import { ipcRenderer, OpenDialogOptions } from 'electron';

export const $Dialog = {
  open: (options: OpenDialogOptions): string[] | undefined => {
    return ipcRenderer.sendSync('Dialog.open', options);
  },
};
