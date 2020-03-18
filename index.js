const {app, BrowserWindow, Menu, ipcMain } = require('electron');

const url = require('url');
const path = require('path');
app.allowRendererProcessReuse = true;

// Pantalla principal
let mainWindow;

app.on('ready', function(){
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        width: 1600,
        height: 900
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'view/index.html'),
        protocol: 'file',
        slashes: true
        
    }))

    Menu.setApplicationMenu([
        
    ]);
    mainWindow.on('closed', function() {
        app.quit();
    })
    
})