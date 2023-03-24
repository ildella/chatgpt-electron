const { app, BrowserWindow, globalShortcut, shell, ipcMain } = require('electron')
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
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload,
      // devTools: true,
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
    shell.openExternal(url);
    return { action: 'deny' };
  })
  
  mainWindow.once('ready-to-show', () => {
    mainWindow.webContents.openDevTools()
  })
  
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.control && input.key.toLowerCase() === 'f') {
      mainWindow.webContents.send('request-find-in-page')
      event.preventDefault()
    }
  })
  ipcMain.on('find-in-page', (event, searchText, options) => {
    console.info('find-in-page', searchText)
    const focusedWindow = BrowserWindow.getFocusedWindow()
    if (focusedWindow) {
      const {webContents} = focusedWindow
      const result = webContents.findInPage(searchText, options)
      console.log({result})
      // mainWindow.webContents.send('restore-focus')
    }
  })
  mainWindow.webContents.on('found-in-page', (event, result) => {
    console.info('found-in-page', result.matches)
    mainWindow.webContents.send('restore-focus')
  })

  ipcMain.on('stop-find-in-page', (event, action) => {
    const focusedWindow = BrowserWindow.getFocusedWindow()
    console.info('stop-find-in-page', action)
    if (focusedWindow) {
      focusedWindow.webContents.stopFindInPage(action)
    }
  })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
