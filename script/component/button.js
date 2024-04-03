export default function createButton({type, label, icon, variant, onClick, parent}){
    const template = document.createElement("template");
    template.innerHTML = `
    <button class="button ${variant ? 'button-' + variant : ''}" type=${type}>
        <span class="button-label">${label}</span>
        ${icon ? `<span class="material-symbols-outlined">${icon}</span>` : ''}
    </button>
    `
    const button = template.content.firstElementChild;
    onClick && button.addEventListener("click", onClick);
    parent.appendChild(button);
    return button;
}