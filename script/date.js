// Convertit une date au format "DD-MM-YYYY" en objet Date
export function convertDate(dateString) {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Mois est 0-indexé dans JavaScript
}

// Fonction de comparaison pour trier les événements par date
export function compareDates(evt1, evt2) {
    const date1 = convertDate(evt1.date);
    const date2 = convertDate(evt2.date);
    return date1 - date2;
}

export function icsDateFormat(date,time){
    const icsDate=date.split("-").reverse().join(""); // mettre la date en YYYYMMDD au lieu de DD-MM-YYYY
    const icsTime=time.split(":").join("")+"00"; // enlever les ":" pour hhmm au lieu de hh:mm
    /*if(parseInt(icsDate,10)>=20240331){  // passage à l'heure d'été UTC+2
        return icsDate+"T"+icsTime+"+0200"; // YYYYMMDDThhmm+0200 (UTC+2)
    } else {
        return icsDate+"T"+icsTime+"+0100"; // YYYYMMDDThhmm+0100 (UTC+1)
    }*/
    return icsDate+"T"+icsTime
    // attention la condition n'est valable que pour 2024, peut-être prendre une table de valeurs
}

export function formatDate(dateString) {
    const months = [
        "janvier", "février", "mars", "avril", "mai", "juin",
        "juillet", "août", "septembre", "octobre", "novembre", "décembre"
    ];
    const daysOfWeek = [
        "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"
    ];
    const [day, monthIndex, year] = dateString.split('-').map(Number);
    const dateObject = new Date(year, monthIndex - 1, day);
    return `${daysOfWeek[dateObject.getDay()-1]} ${day} ${months[monthIndex - 1]}`;
}
