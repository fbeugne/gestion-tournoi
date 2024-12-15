const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('node:path')
const os = require('node:os');
const {loadConfig, getConfig} = require('gestion-tournoi');

const { getPlayers, setPlayerSelection, updatePlayers } = require('gestion-tournoi')
const { getNbPlayersPerTeam, setNbPlayersPerTeam } = require('gestion-tournoi')
const { getNbRounds, setNbRounds } = require('gestion-tournoi')

const { effectuerTirage } = require('gestion-tournoi');
const { loadTirage, getTirage } = require('gestion-tournoi');


let mainWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        },
    });

    displayConfigWindow();;
}

function displayConfigWindow() {
    mainWindow.loadFile('../www/00-config.html');
}

function displaySelectPlayers() {
    mainWindow.loadFile('../www/01-selection-joueurs.html');
}

function genererEquipes() {
    let pdfFilePath = path.join(os.tmpdir(),"tirage.pdf");
    effectuerTirage(pdfFilePath);
    mainWindow.loadFile(pdfFilePath);
    mainWindow.webContents.send('saveApp');
}

app.on('ready', () => {

    ipcMain.on('loadConfig', (_event, jsonData) => {
        loadConfig(jsonData);
    });

    ipcMain.on('getConfig', (event) => {
        event.returnValue = getConfig();
    });

    ipcMain.on('getPlayers', (event) => {
        event.returnValue = getPlayers();
    });

    ipcMain.on('updatePlayers', (_event, players) => {
        updatePlayers(players);
    });
    ipcMain.on('getNbRounds', (event) => {
        event.returnValue = getNbRounds();
    });
    ipcMain.on('setNbRounds', (_event, nbRounds) => {
        setNbRounds(nbRounds);
    });
    ipcMain.on('getNbPlayersPerTeam', (event) => {
        event.returnValue = getNbPlayersPerTeam();
    });
    ipcMain.on('setNbPlayersPerTeam', (_event, nbPlayers) => {
        setNbPlayersPerTeam(nbPlayers);
    });
    ipcMain.on('setPlayerSelection', (_event, player, selected) => {
        setPlayerSelection(player, selected);
    });
    ipcMain.on('effectuerTirage', (event) => {
        let pdfFilePath = path.join(os.tmpdir(),"tirage.pdf");
        event.returnValue = pdfFilePath;
        effectuerTirage(pdfFilePath);
    });

    ipcMain.on('loadTirage', (_event, jsonData) => {
        loadTirage(jsonData);
    });

    ipcMain.on('getTirage', (event) => {
        event.returnValue = getTirage();
    });

    createMainWindow();

    // Créer le menu
    const template = [
        {
            label: 'Configurer',
            click: displayConfigWindow // Ouvrir la fenêtre de configuration
        },
        {
            type: 'separator'
        },
        {
            label: 'Tirage',
            submenu: [
                { label: 'Sélectionner', click: displaySelectPlayers },
                { label: 'Afficher le tirage', click: genererEquipes }
              ]
        },
        {
            type: 'separator'
        },
        {
            label: 'Debug',
            role: 'toggleDevTools'
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

});

app.on('window-all-closed', () => {
    
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createMainWindow();
    }
});
