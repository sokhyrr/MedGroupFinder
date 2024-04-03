const generateRandomPlaceholder = () => (Math.floor(Math.random() * 10000) + 200000 + (Math.random() > 0.2 ? 10000 : 0)).toString();
document.getElementById("solo-input").placeholder = generateRandomPlaceholder();
const list = document.querySelector("#friend-mode-container ol");

let colorPickers;
export let combinationColors = ["#00a7e1", "#1100ff", "#97d2fb", "#3b28cc", "#20bac5"];
colorPickers = document.querySelectorAll('input[type="color"]');
colorPickers.forEach((colorPicker, index) => colorPicker.addEventListener("input", e => {
    combinationColors[index] = e.target.value;
}));

function showColorPickers() {
    if (list.children.length >= 3) {
        const colorPickers = document.querySelectorAll('input[type="color"]');
        colorPickers.forEach(picker => {
            picker.style.display = strictRadios[0].checked ? "inline-flex" : "none";
        });
    }
}

const strictRadios = document.querySelectorAll('input[type="radio"][name="strictness"]');
strictRadios.forEach(strictRadio => {
    strictRadio.addEventListener("change", (e) => {
        showColorPickers();
    })
});

document.addEventListener("DOMContentLoaded", () => {
    const radioElements = document.querySelectorAll('input[type="radio"][name="mode"]');
    const containerElements = document.querySelectorAll('[id$="-mode-container"]');
    const updateMode = () =>
        radioElements.forEach((radio, index) => {
            containerElements[index].style.display = radio.checked ? "flex" : "none";
        });
    updateMode();
    radioElements.forEach(radio => radio.addEventListener("change", updateMode));
});

function friendNumber() {
    const strictnessContainer = document.getElementById('strictness-container');
    const friendNumberSpan = document.getElementById("friend-number-span");
    const addFriendButton = document.getElementById("add-friend-button");
    const removeFriendButton = document.getElementById("remove-friend-button");
    const friendList = document.querySelector("#friend-mode-container ol");
    const MAX_FRIENDS = 5;
    const MIN_FRIENDS = 2;
    let numFriends = friendList.children.length;


    function generateFriendInput(placeholder) {
        const newFriendInput = document.createElement("input");
        newFriendInput.type = "number";
        newFriendInput.classList.add("friend-input");
        newFriendInput.placeholder = placeholder;
        newFriendInput.required = true;
        return newFriendInput;
    }

    function generateColorInput(index) {
        const newColorInput = document.createElement("input");
        newColorInput.type = "color";
        newColorInput.value = combinationColors[index]; //numFriend = N-1, JS 0-indexé

        newColorInput.addEventListener("input", e => {
            combinationColors[index] = e.target.value;
        });
        return newColorInput;
    }

    function updateFriendNumber() {
        friendNumberSpan.textContent = numFriends.toString();
        addFriendButton.disabled = numFriends >= MAX_FRIENDS;
        removeFriendButton.disabled = numFriends <= MIN_FRIENDS;
        strictnessContainer.style.display = friendList.children.length >= 3 ? "inline-flex" : "none";
    }

    updateFriendNumber();
    friendList.querySelectorAll('.friend-input').forEach(input => {
        input.placeholder = generateRandomPlaceholder();
    });
    addFriendButton.addEventListener("click", () => {
        if (numFriends < MAX_FRIENDS) {
            const newListItem = document.createElement("li");
            newListItem.appendChild(generateFriendInput(generateRandomPlaceholder()));
            newListItem.appendChild(generateColorInput(numFriends));
            friendList.appendChild(newListItem);
            numFriends++;
            updateFriendNumber();
        }
    });
    removeFriendButton.addEventListener("click", () => {
        if (numFriends > MIN_FRIENDS) {
            friendList.removeChild(friendList.lastElementChild);
            numFriends--;
            updateFriendNumber();
        }
    });
}

friendNumber();

export function commonToEverybody(arrays) {
    const commonActivities = arrays.reduce((common, array) => {
        return common.filter(obj1 => array.some(obj2 =>
            Object.keys(obj1).every(key =>
                obj2.hasOwnProperty(key) && obj1[key] === obj2[key]
            )
        ));
    });
    return commonActivities;
}

export function combinations(arrayOfArrays, matricules) {// Fonction pour générer toutes les combinaisons possibles d'événements communs entre plusieurs tableaux
    function generateAllCombinations(arrayOfArrays, matricules) {
        const combinations = [];
        const n = arrayOfArrays.length;

        // Parcourir tous les ensembles d'index possibles
        for (let r = n; r >= 2; r--) {
            const indicesCombinations = combinationsWithoutRepetition(n, r);

            // Pour chaque ensemble d'index, vérifier les combinaisons d'événements communs
            indicesCombinations.forEach(indices => {
                const commonEvents = findCommonEvents(arrayOfArrays, indices);
                if (commonEvents.length > 0) {
                    const matriculeSubset = indices.map(i => matricules[i]);
                    combinations.push({
                        commonto: matriculeSubset,
                        commonEvents: commonEvents
                    });
                }
            });
        }

        return combinations;
    }

// Fonction pour trouver les événements communs pour un ensemble donné d'index
    function findCommonEvents(arrayOfArrays, indices) {
        const commonEvents = [];

        // Construire un tableau contenant les objets pour chaque index
        const objectsArrays = indices.map(index => arrayOfArrays[index]);

        // Parcourir le premier tableau d'objets
        arrayOfArrays[indices[0]].forEach(obj1 => {
            // Vérifier si l'objet est présent dans tous les autres tableaux
            if (objectsArrays.every(arr => arr.some(obj => isEqual(obj, obj1)))) {
                commonEvents.push(obj1);
            }
        });

        return commonEvents;
    }

// Fonction pour générer toutes les combinaisons sans répétition
    function combinationsWithoutRepetition(n, r) {
        const combinations = [];
        const indices = Array.from({length: n}, (_, i) => i);

        // Fonction récursive pour générer les combinaisons
        function generateCombinations(index, combination) {
            if (combination.length === r) {
                combinations.push([...combination]);
                return;
            }

            for (let i = index; i < indices.length; i++) {
                combination.push(indices[i]);
                generateCombinations(i + 1, combination);
                combination.pop();
            }
        }

        generateCombinations(0, []);
        return combinations;
    }

// Fonction pour vérifier si deux objets sont identiques
    function isEqual(obj1, obj2) {
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        // Vérifier si les objets ont le même nombre de clés
        if (keys1.length !== keys2.length) {
            return false;
        }

        // Vérifier si les valeurs des clés sont égales
        return keys1.every(key => obj1[key] === obj2[key]);
    }

    const allCombinations = generateAllCombinations(arrayOfArrays, matricules);

    return allCombinations;
}