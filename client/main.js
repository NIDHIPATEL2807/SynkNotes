// main.js (ES module)
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import Store from 'electron-store';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const store = new Store();
let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'dist/index.html')}`;
  win.loadURL(startUrl);
}

app.whenReady().then(createWindow);

ipcMain.on('resize-window', (event, mode) => {
  if (mode === 'compact') win.setSize(400, 300);
  else win.setSize(1200, 800);
});

ipcMain.on('save-setting', (event, { key, value }) => {
  store.set(key, value);
});

ipcMain.handle('load-setting', (event, key) => store.get(key));
