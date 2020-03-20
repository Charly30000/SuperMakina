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
    mainWindow.maximize();
})

const templateMenu = [
    {
        label: 'Exit',
        click() {
            app.quit();
        }
    }
];

//Pantalla puntuaciones
let ventanaPuntuaciones;

// Funcion que crea una ventana con las puntuaciones del juego que el usuario pida
function crearVentanaPuntuaciones() {
    ventanaPuntuaciones = new BrowserWindow({
        width: 800,
        height: 800,
        title: 'Puntuaciones',
        webPreferences: {
            nodeIntegration: true
        },
        show: false
    });
    //ventanaPuntuaciones.setMenu(null);
    ventanaPuntuaciones.loadURL(url.format({
        pathname: path.join(__dirname, 'view/ventanaPuntuaciones.html'),
        protocol: 'file',
        slashes: true
    }))
    ventanaPuntuaciones.on('closed', function () {
        ventanaPuntuaciones = null;
    })
}

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
    crearVentanaPuntuaciones();
    ventanaPuntuaciones.once('ready-to-show', ()=>{
        ventanaPuntuaciones.webContents.send('juego', juego);
        ventanaPuntuaciones.show();
    })
})