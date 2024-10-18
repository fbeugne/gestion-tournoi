
const { jsPDF } = require('jspdf');
require('jspdf-autotable');


const { getSelectedPlayers } = require('./config-tournoi.js');


function printPlayer(doc) {

    // Définir les en-têtes du tableau
    const headers = ["N°", "Joueur", "", "Joueur", "N°"];

    // Définir les données du tableau (5 lignes d'exemple)
    const data = [];
    const selectedPlayersPerIdMatch = getSelectedPlayers().sort((a, b) => a.id_match - b.id_match);
    selectedPlayersPerIdMatch.forEach(selectedPlayer => {
        data.push([selectedPlayer.id_match, selectedPlayer.name, "", "", ""]);
    });

    const selectedPlayersPerName = getSelectedPlayers();
    let indexData = 0;
    selectedPlayersPerName.forEach(selectedPlayer => {
        data[indexData][3] = selectedPlayer.name;
        data[indexData][4] = selectedPlayer.id_match;
        indexData++;
    });


    // Ajouter le tableau au document PDF
    doc.autoTable({
        startY: 20,
        head: [headers],
        tableWidth : 'wrap',
        halign : 'center',
        body: data,
        theme: 'striped',
        styles: { fontSize: 16 },
        didParseCell : (data) => {
            if (data.column.index === 2) {
                data.cell.styles.fillColor = [255, 255, 255];
            }
        },
    });

}


function printScore(doc, parties) {

    // Définir les en-têtes du tableau
    const headers = ["Nom"];
    parties.forEach(partie => {
        headers.push(`Partie ${partie.id + 1}`);
    });
    headers.push(`Total`);
    // Définir les données du tableau (5 lignes d'exemple)
    const data = [];
    const selectedPlayers = getSelectedPlayers();
    selectedPlayers.forEach(selectedPlayer => {
        const dataPlayerScore = [];
        let playerName = selectedPlayer.name;
        const maxPlayerNameLength = 20;
        if(playerName.length > maxPlayerNameLength) {
            playerName = playerName.slice(0,maxPlayerNameLength - 3) + "..."; 
        }
        dataPlayerScore.push([`${playerName}`]);
        parties.forEach(partie => {
            dataPlayerScore.push(`/`);
        });
        dataPlayerScore.push(`  `);
        data.push(dataPlayerScore);
    });

    // Ajouter le tableau au document PDF
    doc.autoTable({
        startY: 20,
        head: [headers],
        body: data,
        theme: 'grid',
        styles: { fontSize: 11, minCellHeight: 12, halign: 'center', valign: 'middle'},
    });
}

function printPartie(doc, partie){

        // Définir les en-têtes du tableau
        const headers = [`Partie ${partie.id + 1}`, "", "", "    ", "    "];

        // Définir les données du tableau (5 lignes d'exemple)
        const data = [];

        let planche = 1;
        partie.pairs.forEach(pair => {
            data.push([planche, pair[0].join('-'), pair[1].join('-'), "    ", "    "]);
            planche += 1;
        });

        // Ajouter le tableau au document PDF
        doc.autoTable({
            startY: 20,
            head: [headers],
            body: data,
            theme: 'grid',
            styles: { fontSize: 16, minCellHeight: 12, halign: 'center', valign: 'middle' },
        });
}

const saveDoc = async(doc, filePath) => {
      
    // Vérifier si on est sous Electron ou Android
    try{
        if(process===undefined){
            throw new Error("plateforme andoid ou ios");
        }
        const isElectron = !!process.versions?.electron;
        if (isElectron) {
            // Comportement Electron (Node.js)
            doc.save(filePath); // Sauvegarde directement dans le système de fichiers
            console.log(`PDF saved at: ${filePath}`);
        }
        else{
            throw new Error("plateforme andoid ou ios");
        }
    }
    catch(error)
    {
        const { Capacitor } = require('@capacitor/core');
        const { Filesystem, Directory } = require('@capacitor/filesystem');
    
        const platform = Capacitor.getPlatform();

        if (platform === 'android' || platform === 'ios') {
            // Comportement Android/iOS (Capacitor)
            const pdfBase64 = doc.output('datauristring').split(',')[1]; // Convertir en base64
            const result = await Filesystem.writeFile({
              path: filePath,
              data: pdfBase64,
              directory: Directory.Documents,
            });
            console.log(`PDF saved at: ${result.uri}`);
          } else {
            console.error('Unsupported platform!');
          }
    }
    
};
    
const exportPdfTirage = async (parties, filePath) => {


    const doc = new jsPDF();

    printPlayer(doc);


    // Feuille permettant la notation des scores
    doc.addPage("", "portrait");
    printScore(doc, parties);

    parties.forEach(partie => {
        doc.addPage("", "portrait");
        printPartie(doc, partie);
    });

    await saveDoc(doc, filePath);
}

module.exports = {
    exportPdfTirage
}