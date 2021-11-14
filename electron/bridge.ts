import { contextBridge } from 'electron';
import { $Console } from '../src/utils-electron/Console';
import { $Dialog } from '../src/utils-electron/Dialog';
import { $FileSystem } from '../src/utils-electron/FileSystem';
import { $Settings } from '../src/utils-electron/Settings';

export const api = {
  $Console,
  $Dialog,
  $FileSystem,
  $Settings,
};

contextBridge.exposeInMainWorld('api', api);
