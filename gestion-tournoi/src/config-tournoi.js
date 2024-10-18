
var configTournoi = null;
var configTirage = null;

class ConfigTournoi {

    constructor(players, nbRounds, nbPlayersPerTeam) {
        this.players = players;
        this.nbRounds = nbRounds;
        this.nbPlayersPerTeam = nbPlayersPerTeam;
    }

    updatePlayers(playersList){
        let last_players = this.players;
        this.players = [];
        playersList.forEach((player) => {
            let player_selected = last_players.find(last_player => last_player.name == player.name);
            let is_selected = false;
            if(player_selected !== undefined) {
                is_selected = player_selected.selected;
            }
            this.players.push({
                    name : player.name,
                    id : this.players.length + 1,
                    selected : is_selected,
                    id_match: 0
            });
        });
    }

    toJSON() {
        return JSON.stringify({
            players: this.players,
            nbRounds: this.nbRounds,
            nbPlayersPerTeam: this.nbPlayersPerTeam
        });
      }

    static fromJSON(jsonData) {
        const data = JSON.parse(jsonData);
        return new ConfigTournoi(data.players, 
            data.nbRounds, 
            data.nbPlayersPerTeam);
    }

}

function loadConfig (jsonData) {

    try {
        configTournoi = ConfigTournoi.fromJSON(jsonData);
        configTirage = ConfigTournoi.fromJSON(jsonData);
    } catch (error) {
        // Si le fichier n'existe pas, retourner des paramètres par défaut
        configTournoi = new ConfigTournoi([], 6, 2);
    }
}

function getConfig()
{
    let jsonData = undefined;
    if (configTournoi != null){
        jsonData = configTournoi.toJSON();
    }
    return jsonData;
}

function setPlayerSelection(playerId, selected)
{
    let player = configTournoi.players.find(player => player.id == playerId);
    player.selected = selected;
}

function getSelectedPlayers() {
    return configTournoi.players.filter(player => player.selected == true);
}

function setNbRounds (nbRounds) {
    configTournoi.nbRounds = nbRounds;
}
function getNbRounds () {
    return configTournoi.nbRounds;
}

function setNbPlayersPerTeam (nbPlayers) {
    configTournoi.nbPlayersPerTeam = nbPlayers;
}
function getNbPlayersPerTeam () {
    return configTournoi.nbPlayersPerTeam;
}

function getPlayers () {
    return configTournoi.players;
}

function updatePlayers (playersList) {
    return configTournoi.updatePlayers(playersList);
}

function isTirageObsolete () {
    let tirageObsolete = false;
    /* On verifie si un tirage est obsolete */
    if (configTirage == null) {
        console.log('config tirage est null');
        tirageObsolete = true;
    }
    else if (configTirage.nbPlayersPerTeam != configTournoi.nbPlayersPerTeam) {
        console.log('nbPlayersPerTeam != ');
        tirageObsolete = true;
    }
    else if (configTirage.nbRounds != configTournoi.nbRounds) {
        console.log('nbRounds != ');
        tirageObsolete = true;
    }
    else {
        /* verification que les memes noms sont selectionnés */
        let selectTirage = configTirage.players.filter(player => player.selected == true);
        let selectCurrent = configTournoi.players.filter(player => player.selected == true);

        if (selectTirage.length !== selectCurrent.length) {
            console.log('player.selected.length != ');
            tirageObsolete = true;
        }
        else {

            // Extraire les valeurs de la propriété et comparer
            const valeurs1 = selectTirage.map(obj => obj["name"]).sort();
            const valeurs2 = selectCurrent.map(obj => obj["name"]).sort();
        
            // Comparer les deux tableaux
            if (!valeurs1.every((valeur, index) => valeur === valeurs2[index])) {
                console.log('player.selected.name != ');
                tirageObsolete = true;
            }
        }
    

        const differences = selectTirage.filter(obj1 => 
            !selectCurrent.some(obj2 => obj1.name === obj2.name)
        );
         if (differences.length > 0) {
        console.log('player.selected != ');
        tirageObsolete = true;
         }
    }
    /* recopie de la config dans celle du tirage */
    if (tirageObsolete == true) {
        configTirage = ConfigTournoi.fromJSON(configTournoi.toJSON());
    }

    return tirageObsolete;
}

module.exports = {
    loadConfig,
    getConfig,
    getPlayers,
    getNbRounds,
    setNbRounds,
    getNbPlayersPerTeam,
    setNbPlayersPerTeam,
    setPlayerSelection,
    getSelectedPlayers,
    updatePlayers,
    isTirageObsolete
}