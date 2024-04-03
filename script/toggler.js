function toggler() {
    const icon = document.querySelector("#toggler");
    const menu = document.querySelector("nav");
    const menuContainer = document.querySelector(".menu-container");
    if (icon.innerHTML === "menu") {
        icon.innerHTML = "close";
        menu.style.transform = "translateX(0%)";
        menuContainer.style.height = "100vh";
    } else {
        icon.innerHTML = "menu";
        menu.style.transform = "translateX(-100%)";
        menuContainer.style.height = "0vh";
    }
}

// Ajouter un écouteur d'événements pour le chargement de la page
document.addEventListener("DOMContentLoaded", () => {
    const togglerButton = document.querySelector("#toggler");
    togglerButton.addEventListener("click", toggler);
});
