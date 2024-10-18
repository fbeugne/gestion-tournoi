const {loadConfig} = require('./config-tournoi');
const {getConfig} = require('./config-tournoi');
const {getPlayers} = require('./config-tournoi');
const {updatePlayers} = require('./config-tournoi');
const {getNbRounds} = require('./config-tournoi');
const {setNbRounds} = require('./config-tournoi');
const {getNbPlayersPerTeam} = require('./config-tournoi');
const {setNbPlayersPerTeam} = require('./config-tournoi');
const {setPlayerSelection} = require('./config-tournoi');
const {getSelectedPlayers} = require('./config-tournoi');
const {effectuerTirage} = require('./tirage');


module.exports = {
    loadConfig,
    getConfig,
    getPlayers,
    updatePlayers,
    getNbRounds,
    setNbRounds,
    getNbPlayersPerTeam,
    setNbPlayersPerTeam,
    setPlayerSelection,
    getSelectedPlayers,
    effectuerTirage
}