const { app, BrowserWindow } = require('electron');

app.on('ready', () => {
  const mainWindow = new BrowserWindow({ 
    width: 1200, 
    height: 1200,
    icon: './favicon-32x32.png',
  });
  mainWindow.loadURL('https://chat.openai.com');
});
