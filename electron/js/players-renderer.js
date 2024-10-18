let homeTotalSelected = 0; // Compteur pour les joueurs sélectionnés
let pdfFilePath;

const saveSelect = () => {
    window.localStorage.setItem('configTournoi', window.tournoi.config.getConfig());
}

const initSelectButton = () => {
    document.getElementById("genererEquipes").addEventListener('click', genererEquipes);
}

const updatePlayerLists = () => {


    const dataPlayers = window.tournoi.config.getPlayers();
    const homePlayersList = document.getElementById('homePlayers');

    const genererEquipesButton = document.getElementById('genererEquipes');

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
            window.tournoi.player.setPlayerSelection(this.id, this.checked);
            genererEquipesButton.textContent = `Sélectionner ${homeTotalSelected} joueurs sur ${dataPlayers.length} `; // Met à jour l'affichage
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
        window.tournoi.player.setPlayerSelection(checkbox.id, checkbox.checked);

    });
    genererEquipesButton.textContent = `Sélectionner ${homeTotalSelected} joueurs sur ${dataPlayers.length} `; // Met à jour l'affichage

}

const genererEquipes = () => {

    const path = require('node:path');
    const os = require('node:os');

    pdfFilePath = path.join(os.tmpdir(),"tirage.pdf");
    window.tournoi.tirage.effectuerTirage(pdfFilePath);
    saveSelect();
    afficherTirage();
}

const afficherTirage = () => {
    window.open(pdfFilePath, "Tirage");
}

const initPlayersRenderer = () => {
    updatePlayerLists();
    initSelectButton();
}