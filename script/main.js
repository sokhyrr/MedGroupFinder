import fetchLecture from "../script/fetch.js";
import { convertDate, compareDates, formatDate } from "../script/date.js";
import { icalDownloadButton } from "../script/ical.js";
import tableToJPGButton from "../script/tojpg.js";

fetchLecture()
    .then(events => {
        console.log(events);
        showEventsTable(events);
    })
    .catch(error => console.error(error));

function showEventsTable(events){
    // Trie les dates dans l'ordre chronologique pour les afficher de la bonne manière :
    events.sort(compareDates);
    const eventsContainer = document.getElementById("divEventsContainer");
    eventsContainer.innerHTML = ""; 
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    table.classList.add("content-table");
    const headerRow = thead.insertRow();
    const columns = ["Événements", "Date et Heure","Lieu"];
    columns.forEach(col=>{
        const th = document.createElement("th");
        th.textContent=col;
        headerRow.appendChild(th);
    });
    table.appendChild(thead);
    let nextEventFound = false;
    events.forEach(evt=>{
        const tr = tbody.insertRow();
        const now = new Date();
        const [hours, minutes]=evt.fin.split(":").map(Number);
        if(convertDate(evt.date).setHours(hours, minutes,0,0)<now.getTime()){
            tr.classList.add("outOfDate");
        } else if (!nextEventFound) {
            tr.classList.add("active-row");
            nextEventFound = true;
        }
        const columns = ["titre","date","lieu"];
        columns.forEach(col=>{
            const cell = tr.insertCell();
            if (col==="date") {
                cell.textContent = `Le ${formatDate(evt.date)} de ${evt.debut} à ${evt.fin}.`
            } else {
                cell.textContent = evt[col];
            }
        });
    });
    table.appendChild(tbody);
    eventsContainer.appendChild(table);
    icalDownloadButton(events);
    tableToJPGButton();
    document.querySelector("footer").style.display="flex";
}

document.addEventListener("DOMContentLoaded", () => document.getElementById("matriculeInput").addEventListener("wheel", event => event.preventDefault()));


