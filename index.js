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
        height: 900,
        darkTheme: true
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
    mainWindow.removeMenu(); // para quitar el menu cuando se vaya a entregar
})

// *****no se puede quitar, el menu debe tener al menos una pestaña, rol o tipo
const templateMenu = [
    {
        label: 'Exit',
        click() {
            app.quit();
        }
    }
];

// Pantalla puntuaciones
let ventanaPuntuaciones;

// Funcion que crea una ventana con las puntuaciones del juego que el usuario pida
function crearVentanaPuntuaciones() {
    if (!ventanaPuntuaciones) {
        ventanaPuntuaciones = new BrowserWindow({
            width: 800,
            height: 400,
            title: 'Puntuaciones',
            darkTheme: true,
            maximizable: false,
            resizable: false,
            webPreferences: {
                nodeIntegration: true
            },
            show: false
        });
        ventanaPuntuaciones.loadURL(url.format({
            pathname: path.join(__dirname, 'view/ventanaPuntuaciones.html'),
            protocol: 'file',
            slashes: true
        }))
        ventanaPuntuaciones.on('closed', function () {
            ventanaPuntuaciones = null;
            mainWindow.setEnabled(true);
            mainWindow.show();
        })
        ventanaPuntuaciones.removeMenu(); // para quitar el menu cuando se vaya a entregar
    }
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
        mainWindow.setEnabled(false);
    })
})