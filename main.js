const { app, BrowserWindow, globalShortcut, shell } = require('electron')
const Store = require('electron-store')
const path = require('path')

const store = new Store()

// app.on('ready', () => {
const createWindow = () => {
  const preload = path.join(__dirname, 'preload.js')
  console.info({preload})
  const {width = 1000, height = 1000, x = 200, y = 100} = store.get('bounds') || {}
  const mainWindow = new BrowserWindow({
    x,
    y,
    width, 
    height,
    icon: './favicon-32x32.png',
    webPreferences: {
      // nodeIntegration: false,
      // contextIsolation: true,
      // enableRemoteModule: false,
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      preload,
    },
    autoHideMenuBar: true,
  })
  mainWindow.loadURL('https://chat.openai.com')
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
  })
  mainWindow.on('close', () => {
    store.set('bounds', mainWindow.getBounds())
  })
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    // event.preventDefault();
    shell.openExternal(url);
    return { action: 'deny' };
  })
  globalShortcut.register('CommandOrControl+f', () => {
    console.info('KEY PRESSED')
    mainWindow.webContents.send('find-in-page')
  })

}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
