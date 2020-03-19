const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const url = require('url');
const path = require('path');
app.allowRendererProcessReuse = true;

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '/node_modules', '.bin', 'electron')
    });
}

// Pantalla principal
let mainWindow;


// Ventana principal
app.on('ready', function () {
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

    const mainMenu = Menu.buildFromTemplate(templateMenu);
    Menu.setApplicationMenu(mainMenu);
    mainWindow.on('closed', function () {
        app.quit();
    })
})

const templateMenu = [
    {
        label: 'Exit',
        click() {
            app.quit();
        }
    }
];


if (process.env.NODE_ENV !== 'production') {
    templateMenu.push({
        label: 'DevTools',
        submenu: [
            {
                label: 'Mostar / Ocultar DevTools',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                },
                accelerator: 'F12'
            },
            {
                role: 'reload'
            }
        ]
    })
}

ipcMain.on('puntuaciones', (evt, juego) => {
    mainWindow.webContents.send('juego', juego);
    console.log(juego);
})

