export default function tableToJPGButton() {
    const button = document.createElement("button");
    button.classList.add("button");
    button.classList.add("download-button");
    button.innerHTML = "<span class=\"button-text\">Télécharge ton calendrier en image</span><span class=\"button-icon\"><ion-icon name=\"camera-outline\"></ion-icon></span>";
    button.addEventListener("click", () => {
        generateJPG().then(downloadJPG);
    });
    document.getElementById("addCalendar").appendChild(button);
}

function generateJPG() {
    return new Promise((resolve, reject) => {
        const tableToCapture = document.querySelector('.content-table');
        const currentDate = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        html2canvas(tableToCapture).then(canvas => {
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = canvas.width;
            finalCanvas.height = canvas.height + 30;
            const ctx = finalCanvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0);
            drawCredits(ctx, finalCanvas.width, canvas.height, currentDate);
            resolve(finalCanvas.toDataURL('image/jpeg'));
        }).catch(error => {
            console.error('Erreur lors de la capture du tableau en image :', error);
            reject(error);
        });
    });
}
function drawCredits(ctx, canvasWidth, tableHeight, currentDate) {
    const creditsText = 'medgroupfinder.sokhyrr.com by @Sokhyrr | Date de génération : ' + currentDate;
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






function downloadJPG(imageData) {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = 'emploi_du_temps.jpg';
    link.click();
}
