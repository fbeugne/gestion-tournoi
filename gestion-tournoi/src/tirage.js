const { getNbPlayersPerTeam } = require('./config-tournoi.js');
const { getNbRounds } = require('./config-tournoi.js');
const { getSelectedPlayers } = require('./config-tournoi.js');
const { isTirageObsolete } = require('./config-tournoi.js');
const { exportPdfTirage } = require('./tirage-pdf.js');

let parties = []; // dictionnaire {id, pairs, resultat}


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generateUniqueGroups(n, k, p, maxRetries = 100, maxRetriesRounds = 10) {
    if (k <= 1 || k > n) {
        throw new Error("k doit être supérieur à 1 et inférieur à n.");
    }

    let matrix = Array.from({ length: n }, () => Array(n).fill(0));
    let rounds = [];

    // Fonction pour vérifier si un groupe est valide (pas de paires répétées)
    function isGroupValid(group) {
        for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
                if (matrix[group[i]][group[j]] > 0) {
                    return false;
                }
            }
        }
        return true;
    }

    // Marquer les paires d'un groupe dans la matrice
    function markGroupPairs(group) {
        for (let i = 0; i < group.length; i++) {
            for (let j = i + 1; j < group.length; j++) {
                matrix[group[i]][group[j]] += 1;
                matrix[group[j]][group[i]] += 1;
            }
        }
    }


    // Fonction pour trouver les joueurs disponibles
    function findAvailablePlayers(remainingPlayers, currentGroup) {
        const availablePlayers = remainingPlayers.filter(
            player => !currentGroup.includes(player)
        );
        
        availablePlayers.sort((a, b) => {
            const aMeetCount = currentGroup.reduce((sum, p) => sum + matrix[a][p], 0);
            const bMeetCount = currentGroup.reduce((sum, p) => sum + matrix[b][p], 0);
            return (aMeetCount + Math.random()) - (bMeetCount + Math.random());
        });

        return availablePlayers;
    }
    let retriesRounds = 0;
    let success = false;
    let bestRounds = [];
    let max_round = 0;

    while (!success && retriesRounds < maxRetriesRounds) {
        // Générer les parties
        matrix = Array.from({ length: n }, () => Array(n).fill(0));
        rounds = [];
        for (let roundId = 0; roundId < p; roundId++) {
            let retries = 0;
            let round = [];
            success = false;

            // Mélanger l'ordre des joueurs au début de chaque partie
            const players = Array.from({ length: n }, (_, i) => i);

            // Tentatives de formation de la partie
            while (!success && retries < maxRetries) {
                round = [];
                const selectedPlayers = new Set();
                success = true;

                // Former les groupes principaux
                for (let i = 0; i <= n - k; i += k) {
                    const group = [];
                    
                    // Commencer par un joueur non sélectionné
                    const remainingPlayers = players.filter(p => !selectedPlayers.has(p));
                    if (remainingPlayers.length < k) break;

                    shuffleArray(remainingPlayers);
                    
                    // TODO prendre les joueurs les moins sélectionnés en 1er pour éviter qu'il se retoruve plusieurs fois en relicat.

                    group.push(remainingPlayers[0]);
                    selectedPlayers.add(remainingPlayers[0]);

                    // Remplir le groupe avec des joueurs disponibles
                    while (group.length < k && selectedPlayers.size < n) {
                        const availablePlayers = findAvailablePlayers(remainingPlayers, group);
                        if (availablePlayers.length === 0) break;

                        const nextPlayer = availablePlayers[0];
                        group.push(nextPlayer);
                        selectedPlayers.add(nextPlayer);
                    }

                    // Vérifier si le groupe formé est valide
                    if (isGroupValid(group) && group.length === k) {
                        markGroupPairs(group);
                        round.push(group);
                    } else {
                        success = false;
                        retries++;
                        break;
                    }
                }

                // Former un dernier groupe plus petit si nécessaire
                const remainingPlayers = players.filter(p => !selectedPlayers.has(p));
                if (success && remainingPlayers.length > 0 && remainingPlayers.length < k) {
                    if (isGroupValid(remainingPlayers)) {
                        markGroupPairs(remainingPlayers);
                        round.push(remainingPlayers);
                    } else {
                        success = false;
                        retries++;
                    }
                }
            }

            // Si une partie complète est formée, l'ajouter
            if (success) {
                rounds.push(round);
            } else {
                retriesRounds++;
                if (roundId > max_round){
                    max_round = roundId;
                    bestRounds = rounds;
                }
                break;
            }
        }
    }
    if (success == false){
        rounds = bestRounds;
    }

    return rounds;
}

function arePairsValid(pairs) {

    const allPairs = []; /* contient la liste de toutes les pairs d'équipes des partie précédente plus de la nouvelle partie qu'on souhaite vérifier */
    const currentPairs = pairs.flat(1);
    parties.forEach(partie => {
        partie.pairs.flat(1).forEach(pair=>allPairs.push(pair));
    });

    let foundPair = currentPairs.some(currentPair => {
        const filterPairs = allPairs.filter(subArray => subArray.toString() == currentPair.toString());

        /* si le filtre retourne une taille non nul, alors la paire a été trouvé */
        if (filterPairs.flat().length > 0) return true;
        else return false;
    });


    return (!(foundPair));
}

function isLastPairValid(pairs) {

    /* On verifie que dans le dernier groupe, qui est le groupe qui contient le reliquat des joueurs
     * Aucun joueur ne s'est déja trouvé dans un le dernier groupe
     * si d'autre n'y sont pas encore
     */
    const lastPlayers = pairs.slice(-1).flat(2);
    const firstGroupLength = pairs[0].flat(2).length;
    let foundLastPlayer = false;
    if (lastPlayers.length != firstGroupLength)
    {
        const allLastPlayers = []; /* contient la liste de toutes les pairs d'équipes des partie précédente plus de la nouvelle partie qu'on souhaite vérifier */
        parties.forEach(partie => {
            partie.pairs.slice(-1).forEach(pair=>allLastPlayers.push(pair.flat()));
        });

        foundLastPlayer = lastPlayers.some(player => {
            /* filtrage sur le joueur sur tous les derniers groupes */
            const filterPairs = allLastPlayers.filter(subArray => subArray.includes(player));

            /* si le filtre retourn une taille non nul, alors le joueur a été trouvé */
            if (filterPairs.flat().length > 0) return true;
            else return false;
        });
    }

    return (!(foundLastPlayer));
}

function genererEquipesAvecMatrice()
{
    const selectedPlayers = getSelectedPlayers();
    const nbPlayersPerTeam = getNbPlayersPerTeam();
    const nb_parties = getNbRounds(); // Nombre de parties souhaitées
    
    /* identification d'un id de joueur aléatoire pour le match */
    const shuffledPlayers = shuffleArray([...selectedPlayers]);
    let id = 1;
    shuffledPlayers.forEach(player => {
        player.id_match = id++;
    });

    let nb_retry = 1000;

    parties = []; // reset des parties

    let num_tirage = 1;
    while ((parties.length < nb_parties) && (nb_retry > 0)){
        nb_retry --;

        /* Generation de partie avec des groups de nb joueurs par équipes */
        let groups = generateUniqueGroups(selectedPlayers.length, nbPlayersPerTeam * 2, nb_parties - parties.length);
    
        for (let i = 0; i < groups.length; i += 1) {
            let pairs = [];
            let groups_partie = groups[i];
            for (let j = 0; j < groups_partie.length; j += 1) {
                let team1 = groups_partie[j].slice(0, groups_partie[j].length / 2).map((x) => shuffledPlayers[x].id_match);
                let team2 = groups_partie[j].slice((groups_partie[j].length / 2),groups_partie[j].length).map((x) => shuffledPlayers[x].id_match);

                const pair = [team1.sort((a, b) => a - b), team2.sort((a, b) => a - b)];

                pairs.push(pair);
            }

            /* il se peut que plusieurs tirage soit necessaire pour former les parties
             * a minima on reverifie que 2 mêmes équipes n'ont pas déjà été formé  
             */
            let pairsValid = false;
            if(nbPlayersPerTeam > 1)
            {
                pairsValid = arePairsValid(pairs);
            }
            else {
                pairsValid = true;
            }
            
            /* vérification que dans la derniere pair, un joueur ne s'y retrouve pas 2 fois
             * pour éviter qu'il se retrouve dans un groupe de moindre taille plusier fois
             * dans la partie
             */
            if (pairsValid == true){
                pairsValid = isLastPairValid(pairs);
            }

            if (pairsValid == true){
                parties.push({
                    id: parties.length,
                    pairs: pairs,
                    num_tirage: num_tirage,
                    resultat: null
                });
            }
            else {
                /* Dans le cas d'une équipe formée d'un élément il faut recommancer tout 
                 * le tirage s'il y a une erreur .
                 * Reset des parties et des groupes pour recommencer.
                 */
                if (nbPlayersPerTeam == 1) {
                    parties = [];
                    groups = [];
                }
            }

        }
        num_tirage++;
    }

}

function effectuerTirage(pdfFilePath) {
    
    if (isTirageObsolete()) {
        genererEquipesAvecMatrice();
        exportPdfTirage(parties, pdfFilePath);
    }

    return pdfFilePath;
}


module.exports = {
    effectuerTirage
}