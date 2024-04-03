import fetchEventsData from "../script/fetch.js";
import viewEmail from "../script/off_email.js";
import icalDownloadButton from "../script/calendar/ical.js";
import tableToJPGButton from "../script/calendar/tojpg.js";
import {commonToEverybody, combinations} from "../script/friendmode.js";
import {createTable} from "../script/component/table.js";
import {savedMatricule, showAddMatricule, showSavedMatricule} from "../script/localstorage.js";
import {combinationColors} from "../script/friendmode.js";

const combinationContainer = document.getElementById("combination-container");
const calendarContainer = document.getElementById("calendar-container");
const downloadContainer = document.getElementById("download-container");

const clearContainers = (...containers) => containers.forEach(container => container.innerHTML = '');

const lucentePezzin = `<a style="color:#3a2f75;" href="#" id="viewEmailLink" data-email-file="../mails/lucente-12-03-24.eml">Mail concerné ici</a>`;
const arcMG = document.createElement("p")
arcMG.innerHTML = `Les salles qui nous ont été communiquées par mail récemment pour <strong>l'ARC Med G et l'atelier communication</strong> viennent d'être <strong>ajoutées à MedGroupFinder</strong><br><strong>L'absence de Loïc Pezzin</strong> pour l'ARC MG 3 a été prise en compte. En cas de doute, <strong>référez vous au mail</strong> reçu le 12 mars. ` + lucentePezzin;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('solo-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const matricule = "20" + document.getElementById('solo-input').value;
        fetchEventsData(matricule)
            .then(events => {
                showEventsTable(events, "solo");
                showAddMatricule();
            })
            .catch(error => {
                console.error(error);
                noMatricule();
            });
    });
    const strictnessRadio = document.querySelectorAll('input[type="radio"][name="strictness"]');
    let strictness = "commonToEverybody";
    strictnessRadio.forEach(radio => {
        radio.addEventListener('change', (event) => {
            strictness = event.target.value;
        });
    });
    document.getElementById('friend-form').addEventListener('submit', (e) => {
        e.preventDefault();
        document.querySelectorAll("button.download-button").forEach(btn => btn.remove());
        const friends = [];
        document.querySelectorAll(".friend-input").forEach(input => friends.push("20" + input.value));
        fetchEventsData(friends)
            .then(friendsEvents => {
                if (strictness === "commonToEverybody") showEventsTable(commonToEverybody(friendsEvents), strictness);
                else if (strictness === "combinations") {
                    const allCombinations = combinations(friendsEvents, friends.map(friend => friend.substring(2)));
                    showEventsTable(allCombinations, strictness);
                }
            })
            .catch(error => console.error(error));
        noMatricule();
    });
});

export function showEventsTable(events, mode) {
    addAlert(arcMG);
    const noEvent = document.createElement("p");
    noEvent.innerText = "Pas d'activités trouvées";

    clearContainers(combinationContainer, calendarContainer, downloadContainer);
    if (mode === "combinations") {
        clearContainers(combinationContainer, calendarContainer, downloadContainer);
        events.forEach(combination => {
            const lot = combination.commonto.toString();
            const lotUnderscore = lot.split(",").join("_");

            const tableDownload = document.createElement('div');
            tableDownload.id = `calendar-container-${lotUnderscore}`;

            let lotColor = [];
            lot.split(",").forEach((matricule, index) => {
                document.querySelectorAll(".friend-input").forEach((friendMatricule, index) => {
                    friendMatricule = friendMatricule.value;
                    if (matricule === friendMatricule) {
                        lotColor.push(`<span style="color:${combinationColors[index]};">${matricule}</span>`);

                    }
                })
            });
            const h1 = document.createElement("h1");
            h1.style.textAlign = "center";
            h1.innerHTML = "Commun à " + lotColor.toString().split(",").join(" & ");

            tableDownload.appendChild(h1);

            const table = events.length > 0 ? createTable(combination.commonEvents) : `<h2>Pas d'activité trouvée.</h2>`;
            table.id = lotUnderscore;
            tableDownload.classList.add("combination-divider");
            tableDownload.appendChild(table);


            combinationContainer.appendChild(tableDownload);
            tableToJPGButton(table.id);
        });
    } else {
        const h1 = document.createElement("h1");
        h1.style.textAlign = "center";
        if (mode === "commonToEverybody") {
            h1.innerText = "Commun à tous";
        }
        if (mode === "solo") {
            h1.innerText = "Mon horaire personnel";
            icalDownloadButton(events);
        }
        calendarContainer.appendChild(h1);
        const table = createTable(events);
        if (events.length>0) {
            calendarContainer.appendChild(table);
            tableToJPGButton();
        } else {
            calendarContainer.appendChild(noEvent);
            document.querySelector("footer").style.display = "none";
        }
    }
    document.querySelector("footer").style.display = "flex";
    document.getElementById('viewEmailLink').addEventListener('click', function (event) {
        event.preventDefault();
        viewEmail(this.getAttribute('data-email-file'));
    });
}

document.addEventListener("DOMContentLoaded", () => document.querySelectorAll('input[type="number"]').forEach(input => input.addEventListener("wheel", event => event.preventDefault())));

//TODO gérer les cas d'aout d'input pour éviter le scroll

function addAlert(content) {
    const alertContainer = document.getElementById("alert-container");
    clearContainers(alertContainer);
    alertContainer.appendChild(content)
    alertContainer.style.display = "inherit";
}

export function noMatricule(){
    clearContainers(calendarContainer, downloadContainer);
    const noMatriculeMessage = document.createElement('p')
    noMatriculeMessage.innerHTML=`Pas d'activité trouvée pour ce matricule. Réessayez avec un matricule valable, de 6 chiffres sans le 's' (ou 7 chiffres s'il commence par 23). En cas de problème persistant, utilisez le <a href="./pages/contact.html">formulaire de contact</a> `;
    addAlert(noMatriculeMessage);
    document.querySelector("footer").style.display = "none";
}
document.addEventListener("DOMContentLoaded", () => savedMatricule && showSavedMatricule());