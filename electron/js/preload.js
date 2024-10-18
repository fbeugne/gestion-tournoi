const { contextBridge, ipcRenderer } = require('electron/renderer')


contextBridge.exposeInMainWorld('tournoi', {
    config: {

        loadConfig(jsonData) {
            ipcRenderer.send('loadConfig', jsonData);
        },
        getConfig() {
            return ipcRenderer.sendSync('getConfig');
        },
        getPlayers() {
            return ipcRenderer.sendSync('getPlayers');
        },
        getNbRounds() {
            return ipcRenderer.sendSync('getNbRounds');
        },
        getNbPlayersPerTeam() {
            return ipcRenderer.sendSync('getNbPlayersPerTeam');
        },
        updatePlayers(players) {
            return ipcRenderer.send('updatePlayers', players);
        },
        setNbRounds (nbRounds) {
            ipcRenderer.send('setNbRounds', parseInt(nbRounds));
        },
        setNbPlayersPerTeam (nbPlayers) {
            ipcRenderer.send('setNbPlayersPerTeam', parseInt(nbPlayers));
        }
    },
    player: {
        setPlayerSelection(playerId, selected) {
            ipcRenderer.send('setPlayerSelection', parseInt(playerId), selected);
        }
    },
    tirage: {
        effectuerTirage() {
            return ipcRenderer.sendSync('effectuerTirage');
        }
    }
});

