import { compareDates, formatDate, convertDate } from "../calendar/date.js";

export function createTable(events) {
    events.sort(compareDates);
    const table = document.createElement("table");
    table.classList.add("content-table");
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    ["Événements", "Date et Heure", "Lieu"].forEach(col => {
        const th = headerRow.insertCell();
        th.textContent = col;
    });
    const tbody = document.createElement("tbody");
    let nextEventFound = false;
    const now = new Date();
    events.forEach(evt => {
        const tr = tbody.insertRow();
        const [hours, minutes] = evt.fin.split(":").map(Number);
        const eventTime = convertDate(evt.date).setHours(hours, minutes, 0, 0);
        if (eventTime < now.getTime()) {
            tr.classList.add("outOfDate");
        } else if (!nextEventFound) {
            tr.classList.add("active-row");
            nextEventFound = true;
        }
        ["titre", "date", "lieu"].forEach(col => {
            const cell = tr.insertCell();
            cell.textContent = col === "date" ? `Le ${formatDate(evt.date)} de ${evt.debut} à ${evt.fin}.` : evt[col];
        });
    });
    table.appendChild(tbody);
    return table;
}