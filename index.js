const electron = require('electron');
const url = require('url');
const path = require('path');

const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addWindow;

app.on('ready', function () {
    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', function () {
        app.quit();
    })

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    
    Menu.setApplicationMenu(mainMenu);
});

function createNewFile() {
    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Create new file',
        webPreferences: {
            nodeIntegration: true
        }
    });

    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    }));

    addWindow.on('close', function () {
        addWindow = null;
    })
};

ipcMain.on('item:add', function (e, name) {
    mainWindow.webContents.send('item:add', name);
    addWindow.close();
});

const mainMenuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New File',
                click () {
                    createNewFile();
                }
            },
            {
                label: 'Delete Files',
                click () {
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label: "Quit",
                accelerator: process.platform == 'darwin' ? 'Command + Q' : 'Ctrl+Q',
                click () {
                    app.quit();
                }
            }
        ]
    }
];

if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({});
}

if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [
            {
                label: 'Toggle Dev Tools',
                accelerator: process.platform == 'darwin' ? 'Command + I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    });
}