import createButton from "../script/component/button.js";
import fetchEventsData from "../script/fetch.js";
import {showEventsTable, noMatricule} from "../script/main.js";

let addMatriculeButton;

export let savedMatricule = localStorage.getItem("matricule");
window.addEventListener("storage", () => savedMatricule = localStorage.getItem("matricule"));


const savedMatriculeContainer = document.getElementById("saved-matricule-container");
const addMatriculeContainer = document.getElementById("add-matricule-container");
const soloInput = document.getElementById('solo-input');

const isEmpty = element => element.innerHTML.trim() === '';

function appendAddMatriculeButton() {
    if (isEmpty(addMatriculeContainer)) {
        addMatriculeButton = createButton({
            type: "button",
            label: "",
            icon: "person_add",
            variant: "matricule-storage",
            onClick: e => {
                addMatricule();
                addMatriculeButton.disabled = !isEmpty(savedMatriculeContainer);
            },
            parent: addMatriculeContainer
        });
    }
    addMatriculeButton.disabled = !isEmpty(savedMatriculeContainer);
}

function getMatricule(){
    let matricule= soloInput.value;
    soloInput.addEventListener("input", () => matricule = soloInput.value);
    return matricule;
}

function addMatricule() {
    localStorage.setItem("matricule", getMatricule());
    showSavedMatricule(); // Appel direct de la fonction après l'enregistrement du matricule
}


export function showAddMatricule() {
    appendAddMatriculeButton();
}


export function removeMatricule() {
        localStorage.removeItem("matricule");
        savedMatriculeContainer.innerHTML = "";
        addMatriculeButton && (addMatriculeButton.disabled = false);
}


function appendSavedMatriculeButton(matricule) {
    createButton({
        type: "button",
        label: matricule,
        icon: "fast_forward",
        variant: "matricule",
        onClick: e => {
            fetchEventsData("20" + matricule)
                .then(events => {
                    showEventsTable(events, "solo");
                })
                .catch(error => {
                    console.error(error);
                    noMatricule();
                });
        },
        parent: savedMatriculeContainer
    });
}

function appendRemoveMatriculeButton() {
    createButton({
        type: "button",
        label: "",
        icon: "person_remove",
        variant: "matricule-storage",
        onClick: e => {
            removeMatricule();
        },
        parent: savedMatriculeContainer
    });
}

export function showSavedMatricule() {
    const savedMatricule = localStorage.getItem("matricule");
    savedMatriculeContainer.innerHTML = "";
    appendSavedMatriculeButton(savedMatricule);
    appendRemoveMatriculeButton();
}

