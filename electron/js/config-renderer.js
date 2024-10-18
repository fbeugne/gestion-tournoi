const initConfig = () => {
    if (window.tournoi.config.getConfig() === undefined) {
        window.tournoi.config.loadConfig(window.localStorage.getItem('configTournoi'));
    }
}

const saveConfig = () => {
    window.localStorage.setItem('configTournoi', window.tournoi.config.getConfig());
}

/*********************************************************/
/*               Config du nombre de parties             */
/*********************************************************/
// Fonction pour mettre à jour le nombre de parties
const initNbRounds = () => {

    const nbRounds = window.tournoi.config.getNbRounds();
    document.getElementById("config_nb_parties").value = nbRounds;

    // Ajoute un gestionnaire d'événements pour mettre à jour le nombre de joueur
    document.getElementById("config_nb_parties").addEventListener('change', updateNbRounds);
    
};


// Fonction pour mettre à jour le nombre de parties
const updateNbRounds = () => {
    const nbRounds = document.getElementById("config_nb_parties").value;
    window.tournoi.config.setNbRounds(nbRounds);

    saveConfig();
};

/*********************************************************/
/*               Config du nombre de joueurs             */
/*********************************************************/

// Fonction pour mettre à jour le nombre de joueur
const initNbPlayers = () => {
    const nbPlayers = window.tournoi.config.getNbPlayersPerTeam();
    document.getElementById("config_nb_joueurs").value = nbPlayers;

    // Ajoute un gestionnaire d'événements pour mettre à jour le nombre de joueur
    document.getElementById("config_nb_joueurs").addEventListener('change', updateNbPlayers);
};


// Fonction pour mettre à jour le nombre de joueur
const updateNbPlayers = () => {
    const nbPlayers = document.getElementById("config_nb_joueurs").value;
    window.tournoi.config.setNbPlayersPerTeam(nbPlayers);

    saveConfig();
};


/*********************************************************/
/*               Config de la liste des joueurs          */
/*********************************************************/

// Afficher la liste des personnes 
const renderList = () => {
    const textarea = document.getElementById("personList");

    personList = window.tournoi.config.getPlayers();

    textarea.value = "";
    personList.forEach(person => {
        textarea.value += person.name;
        textarea.value += "\n";
    });

    // Ajoute un gestionnaire d'événements pour mettre à jour le nombre de joueur
    document.getElementById("personList").addEventListener('keyup', parsePersonList);

}



const parsePersonList = () => {
    const textarea = document.getElementById("personList");
    const personArray = textarea.value
        .split("\n")  // Sépare chaque ligne
        .map(name => name.trim())  // Supprime les espaces inutiles
        .filter(name => name !== "");  // Ignore les lignes vides
    
    const playersList = [];
    personArray.forEach(person => {
        playersList.push({name:person});
    });

    window.tournoi.config.updatePlayers(playersList);

    saveConfig();
}

const initConfigRenderer = () => {

    initConfig();
    initNbRounds();
    initNbPlayers();
    // Afficher la liste initiale
    renderList();
}