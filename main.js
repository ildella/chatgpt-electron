const { app, BrowserWindow } = require('electron')
const Store = require('electron-store')
const store = new Store()

app.on('ready', () => {
  const {width = 1200, height = 1200} = store.get('windowSize') || {}
  const mainWindow = new BrowserWindow({ 
    width, 
    height,
    icon: './favicon-32x32.png',
  })
  mainWindow.loadURL('https://chat.openai.com')
  mainWindow.on('close', () => {
    const { width, height } = mainWindow.getBounds()
    store.set('windowSize', { width, height })
  })
})
