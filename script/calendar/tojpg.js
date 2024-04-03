import createButton from "../component/button.js";

export default function tableToJPGButton(combinationID=undefined) {
    const label = `Télécharge ton calendrier en image ${combinationID ? ` ${combinationID}` : ''}`;
    const parent = combinationID ? document.getElementById(`calendar-container-${combinationID}`) : document.getElementById("download-container");
    createButton({
        type : "button",
        label : label,
        icon : "screenshot", 
        variant : "download",
        onClick : e => generateJPG(combinationID).then(downloadJPG), 
        parent: parent
    });
}

function generateJPG(combinationID) {
    return new Promise((resolve, reject) => {
        let tableToCapture;
        if(combinationID){
        tableToCapture = document.getElementById(combinationID);
    } else {
        tableToCapture = document.querySelector(".content-table");
    }
        const currentDate = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        html2canvas(tableToCapture).then(canvas => {
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = canvas.width;
            finalCanvas.height = canvas.height + 30;
            const ctx = finalCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0);
            drawCredits(ctx, finalCanvas.width, canvas.height, currentDate);
            resolve([finalCanvas.toDataURL('image/jpeg'), combinationID]);
        }).catch(error => {
            console.error('Erreur lors de la capture du tableau en image :', error);
            reject(error);
        });
    });
}
function drawCredits(ctx, canvasWidth, tableHeight, currentDate) {
    const creditsText = 'mgf.sokhyrr.com by @Sokhyrr | Date de génération : ' + currentDate;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, tableHeight, canvasWidth, 30);
    ctx.font = '12px Arial';
    ctx.fillStyle = 'white';
    
    // Calcul de la largeur totale du texte
    const textWidth = ctx.measureText(creditsText).width;
    
    // Calcul de la position de départ pour centrer horizontalement
    const xPosition = (canvasWidth - textWidth) / 2;
    
    // Dessin du texte centré horizontalement
    ctx.fillText(creditsText, xPosition, tableHeight + 20);
}

function downloadJPG([imageData, combinationID]) {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'Horaire Q6 ' + (combinationID ? "commun à "+combinationID : '') + '.jpg';
    link.click();
}
