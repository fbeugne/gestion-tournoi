let homeTotalSelected = 0; // Compteur pour les joueurs sélectionnés
let pdfFilePath = undefined;


const updatePlayerLists = () => {


    const dataPlayers = window.tournoi.config.getPlayers();
    const homePlayersList = document.getElementById('homePlayers');

    const nbSelectLabel = document.getElementById('nb_select');

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
            nbSelectLabel.textContent = `Sélectionner ${homeTotalSelected} joueurs sur ${dataPlayers.length} `; // Met à jour l'affichage
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
    nbSelectLabel.textContent = `Sélectionner ${homeTotalSelected} joueurs sur ${dataPlayers.length} `; // Met à jour l'affichage

}

const initPlayersRenderer = () => {
    updatePlayerLists();
}