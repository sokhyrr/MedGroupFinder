export function convertDate(dateString) {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); 
}

export function compareDates(evt1, evt2) {
    const date1 = convertDate(evt1.date);
    const date2 = convertDate(evt2.date);
    return date1 - date2;
}

export function icsDateFormat(date,time){
    const icsDate=date.split("-").reverse().join("");
    const icsTime=time.split(":").join("")+"00";
    return icsDate+"T"+icsTime
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