import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import Store from 'electron-store';

let mainWindow: BrowserWindow | null;

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// const assetsPath =
//   process.env.NODE_ENV === 'production'
//     ? process.resourcesPath
//     : app.getAppPath()

function createWindow() {
  mainWindow = new BrowserWindow({
    // icon: path.join(assetsPath, 'assets', 'icon.png'),
    width: 1100,
    height: 700,
    backgroundColor: '#191622',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
    },
    show: false,
  });

  mainWindow.maximize();

  mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

  if (app.isPackaged) {
    mainWindow.removeMenu();
  }

  mainWindow.show();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function registerListeners() {
  /**
   * This comes from bridge integration, check bridge.ts
   */
  ipcMain.on('Console.log', (_, message) => {
    console.log(message);
  });

  ipcMain.on('Dialog.open', (event, options) => {
    event.returnValue = dialog.showOpenDialogSync(options);
  });
}

app
  .on('ready', createWindow)
  .whenReady()
  .then(registerListeners)
  .catch((e) => console.error(e));

app.on('window-all-closed', () => {
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

Store.initRenderer();
