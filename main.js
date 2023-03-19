const { app, BrowserWindow } = require('electron')
const Store = require('electron-store')
const { shell } = require('electron');

const store = new Store()

app.on('ready', () => {
  const {width = 1000, height = 1000, x = 200, y = 100} = store.get('bounds') || {}
  const mainWindow = new BrowserWindow({
    x,
    y,
    width, 
    height,
    icon: './favicon-32x32.png',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
  })
  mainWindow.loadURL('https://chat.openai.com')
  mainWindow.on('close', () => {
    const bounds = mainWindow.getBounds()
    store.set('bounds', bounds)
  })
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // event.preventDefault();
    shell.openExternal(url);
    return { action: 'deny' };
  })
})
