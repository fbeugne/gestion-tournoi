
import * as gestionTournoi from 'gestion-tournoi';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { FileOpener } from '@capacitor-community/file-opener';


function updateEtatBoutonSelect(etatBouton, param1, param2) {

  /* 1ere etape : propose à l'utilisateur de sélectionner les joueurs*/
  if (etatBouton == 0){
    document.getElementById("nb_select").textContent = "Sélectionner les joueurs";
  }
  /* 1eme étape : porpose à l'utilisateur d'effectuer le tirage */
  if (etatBouton == 1){
    if ((param1 == 0) || (param1 == 1)){
      document.getElementById("nb_select").textContent = `${param1} joueur sélectionné sur ${param2}`;  
    }
    else {
      document.getElementById("nb_select").textContent = `${param1} joueurs sélectionnés sur ${param2}`;
    }
  }

}

function afficherConfig(){
  document.getElementById('content-players').style.display = 'none';
  document.getElementById('content-config').style.display = 'block';
  updateEtatBoutonSelect(0);
}

function afficherSelect(){
  document.getElementById('content-config').style.display = 'none';
  document.getElementById('content-players').style.display = 'block';
  updatePlayerLists();
}

const initApp = () => {

  initConfig();
  initNbRounds();
  initNbPlayers();
  renderList();

  document.getElementById("bouton_config").addEventListener('click', afficherConfig);
  document.getElementById("bouton_select").addEventListener('click', afficherSelect);
  document.getElementById("bouton_generer").addEventListener('click', genererEquipes);
  afficherConfig();
}

const initConfig = () => {
  if (gestionTournoi.getConfig() === undefined) {
    gestionTournoi.loadConfig(window.localStorage.getItem('configTournoi'));
  }
}

const saveConfig = () => {
  window.localStorage.setItem('configTournoi', gestionTournoi.getConfig());
}

/*********************************************************/
/*               Config du nombre de parties             */
/*********************************************************/
// Fonction pour mettre à jour le nombre de parties
const initNbRounds = () => {

  const nbRounds = gestionTournoi.getNbRounds();
  document.getElementById("config_nb_parties").value = nbRounds;

  // Ajoute un gestionnaire d'événements pour mettre à jour le nombre de joueur
  document.getElementById("config_nb_parties").addEventListener('change', updateNbRounds);
  
};


// Fonction pour mettre à jour le nombre de parties
const updateNbRounds = () => {
  const nbRounds = document.getElementById("config_nb_parties").value;
  gestionTournoi.setNbRounds(nbRounds);

  saveConfig();
};

/*********************************************************/
/*               Config du nombre de joueurs             */
/*********************************************************/

// Fonction pour mettre à jour le nombre de joueur
const initNbPlayers = () => {
  const nbPlayers = gestionTournoi.getNbPlayersPerTeam();
  document.getElementById("config_nb_joueurs").value = nbPlayers;

  // Ajoute un gestionnaire d'événements pour mettre à jour le nombre de joueur
  document.getElementById("config_nb_joueurs").addEventListener('change', updateNbPlayers);
};


// Fonction pour mettre à jour le nombre de joueur
const updateNbPlayers = () => {
  const nbPlayers = document.getElementById("config_nb_joueurs").value;
  gestionTournoi.setNbPlayersPerTeam(nbPlayers);

  saveConfig();
};


/*********************************************************/
/*               Config de la liste des joueurs          */
/*********************************************************/

// Afficher la liste des personnes 
const renderList = () => {
  const textarea = document.getElementById("personList");

  let personList = gestionTournoi.getPlayers();

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

  gestionTournoi.updatePlayers(playersList);
  saveConfig();
}


let homeTotalSelected = 0; // Compteur pour les joueurs sélectionnés
let pdfFilePath='tirage.pdf';

const saveSelect = () => {
    window.localStorage.setItem('configTournoi', gestionTournoi.getConfig());
}

const updatePlayerLists = () => {

    const dataPlayers = gestionTournoi.getPlayers();
    const homePlayersList = document.getElementById('homePlayers');

    // Vider les listes
    homePlayersList.innerHTML = '';

    dataPlayers.forEach(player => {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('checkbox');


        const checkbox = document.createElement('input');

        checkbox.type = 'checkbox';
        checkbox.id = player.id;
        checkbox.value = player.name;
        checkbox.checked = player.selected;

        // Ajoute un gestionnaire d'événements pour mettre à jour les compteurs
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                homeTotalSelected++;
            } else {
                homeTotalSelected--;
            }
            gestionTournoi.setPlayerSelection(this.id, this.checked);
            updateEtatBoutonSelect(1, homeTotalSelected, dataPlayers.length);
          });

        const label = document.createElement('label');
        label.htmlFor = player.id;
        label.textContent = player.name;

        playerDiv.appendChild(checkbox);
        playerDiv.appendChild(label);
        homePlayersList.appendChild(playerDiv);
    });

    homeTotalSelected = 0;

    // Compte les cases à cocher sélectionnées
    const homeCheckboxes = homePlayersList.querySelectorAll('input[type="checkbox"]');
    homeCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            homeTotalSelected++;
        }
        gestionTournoi.setPlayerSelection(checkbox.id, checkbox.checked);

    });
    updateEtatBoutonSelect(1, homeTotalSelected, dataPlayers.length);
}

const genererEquipes = () => {

    pdfFilePath = "tirage.pdf";
    gestionTournoi.effectuerTirage(pdfFilePath);
    saveSelect();
    afficherTirage();
}

const afficherTirage = async () => {

  
  try {
    // Vérifie si le fichier existe (optionnel)
    const file = await Filesystem.stat({
      path: pdfFilePath,
      directory: Directory.Documents,
    });

    if (file) {
          // Récupère l'URI du fichier
      const result = await Filesystem.getUri({
        path: pdfFilePath,
        directory: Directory.Documents,
      });

      console.log('Ouverture du fichier PDF : ', result.uri);
      
      // Ouvre le fichier PDF
      await FileOpener.open({
        filePath: result.uri,
        contentType: 'application/pdf',
      });

    }
  } catch (error) {
    console.error('Erreur lors de l\'ouverture du PDF :', error);
  }
}


initApp();
