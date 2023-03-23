console.info('PRELOAD')

const { ipcRenderer, remote } = require('electron')

const webContents = remote.getCurrentWebContents()

ipcRenderer.on('find-in-page', param => {
  console.info('ipcRenderer find in page...', {param})
  webContents.findInPage('')
  webContents.showFindInPage()
})
