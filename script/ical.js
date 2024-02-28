import { convertDate, compareDates, icsDateFormat} from "../script/date.js";

export function icalDownloadButton(events){
    const button = document.createElement("button");
    button.classList.add("button");
    button.classList.add("download-button");
    button.innerHTML = "<span class=\"button-text\">Télécharge ton calendrier au format iCal (.ics)</span><span class=\"button-icon\"><ion-icon name=\"calendar-outline\"></ion-icon></span>";
    button.addEventListener("click", () => downloadIcalFile(generateIcal(events)));
    document.getElementById("addCalendar").innerHTML="<h1>Ajouter ces événements à mon Agenda</h1>";
    document.getElementById("addCalendar").appendChild(button);

}

function generateIcal(events){
    const newline = "\r\n";
    let iCalendar="BEGIN:VCALENDAR"+newline+
        "VERSION:2.0"+newline+
        "PRODID:-//Sokhyrr//mgf.sokhyrr.com//FR"+newline+
        "CALSCALE:GREGORIAN"+newline+
        "METHOD:PUBLISH"+newline+
        "X-WR-CALNAME:MedGroupFinder"+newline+
        "BEGIN:VTIMEZONE"+newline+
        "TZID:Europe/Brussels"+newline+
        "BEGIN:STANDARD"+newline+
        "TZOFFSETFROM:+0200"+newline+
        "TZOFFSETTO:+0100"+newline+
        "TZNAME:CET"+newline+
        "DTSTART:20221031T030000"+newline+
        "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU"+newline+
        "END:STANDARD"+newline+
        "BEGIN:DAYLIGHT"+newline+
        "TZOFFSETFROM:+0100"+newline+
        "TZOFFSETTO:+0200"+newline+
        "TZNAME:CEST"+newline+
        "DTSTART:20230326T020000"+newline+
        "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU"+newline+
        "END:DAYLIGHT"+newline+
        "END:VTIMEZONE"+newline;
    events.forEach((e)=>{
        const eventDate = convertDate(e.date);
        const currentDate = new Date();
        if (eventDate && eventDate > currentDate) {
            iCalendar += "BEGIN:VEVENT" + newline
                + "SUMMARY:" + e.titre + newline
                + "DESCRIPTION:Événement ajouté automatiquement au calendrier via MedGroupFinder by @Sokhyrr." + newline
                + "DTSTART;TZID=Europe/Brussels:" + icsDateFormat(e.date, e.debut) + newline
                + "DTEND;TZID=Europe/Brussels:" + icsDateFormat(e.date, e.fin) + newline
                + "LOCATION:" + e.lieu + newline
                + "END:VEVENT" + newline;
        }
    });
    iCalendar += "END:VCALENDAR";
    console.log(iCalendar);
    return iCalendar;
}


function downloadIcalFile(iCalendar) {
    const blob = new Blob([iCalendar], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'calendrier.ics'); // Donner un nom personnalisé au fichier, par exemple année et matricule et version du fichier JSON
    link.setAttribute('hidden', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
