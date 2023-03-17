const { app, BrowserWindow } = require('electron');

let mainWindow;

app.on('ready', () => {
  mainWindow = new BrowserWindow({ 
    width: 800, 
    height: 600,
    icon: './favicon-32x32.png' // <-- add this line
  });
  mainWindow.loadURL('https://chat.openai.com');
});
