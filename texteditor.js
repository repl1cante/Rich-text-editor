const output = document.getElementById('output');
const toolbar = document.getElementById('toolbar');
const charCount = document.getElementById('charCount');
const wordCount = document.getElementById('wordCount');
const saveButton = document.getElementById('saveButton');

const tools = [
    { command: 'justifyLeft', icon: 'fa-align-left', tooltip: 'Alinhar à Esquerda' },
    { command: 'justifyCenter', icon: 'fa-align-center', tooltip: 'Centralizar' },
    { command: 'bold', icon: 'fa-bold', tooltip: 'Negrito' },
    { command: 'italic', icon: 'fa-italic', tooltip: 'Itálico' },
    { command: 'underline', icon: 'fa-underline', tooltip: 'Sublinhado' },
    { command: 'insertOrderedList', icon: 'fa-list-ol', tooltip: 'Lista Ordenada' },
    { command: 'insertUnorderedList', icon: 'fa-list-ul', tooltip: 'Lista Não Ordenada' },
    { command: 'createlink', icon: 'fa-link', tooltip: 'Inserir Link' },
    { command: 'undo', icon: 'fa-undo', tooltip: 'Desfazer' },
    { command: 'redo', icon: 'fa-redo', tooltip: 'Refazer' },
    { command: 'foreColor', icon: 'fa-palette', tooltip: 'Cor do Texto' }
];

const colorMap = {
    "preto": "#000000",
    "branco": "#ffffff",
    "vermelho": "#ff0000",
    "verde": "#008000",
    "azul": "#0000ff",
    "amarelo": "#ffff00",
    "rosa": "#ffc0cb",
    "laranja": "#ffa500",
    "roxo": "#800080",
    "cinza": "#808080",
    "marrom": "#a52a2a",
    "ciano": "#00ffff",
    "magenta": "#ff00ff",
    "prata": "#c0c0c0",
    "dourado": "#ffd700"
};

tools.forEach(tool => {
    const button = document.createElement('button');
    button.classList.add('tool--btn');
    button.dataset.command = tool.command;
    button.dataset.tooltip = tool.tooltip;
    button.innerHTML = `<i class='fas ${tool.icon}'></i>`;
    button.addEventListener('click', () => {
        if (tool.command === 'createlink') {
            const url = prompt("Coloque o link aqui: ", "http://");
            document.execCommand(tool.command, false, url);
        } else if (tool.command === 'foreColor') {
            const color = prompt("Coloque o Código Hexadecimal ou o nome da cor: ", "#000000");
            const colorCode = colorMap[color.toLowerCase()] || color;
            document.execCommand(tool.command, false, colorCode);
        } else {
            document.execCommand(tool.command, false, null);
        }
    });
    toolbar.appendChild(button);
});

const saveContent = (type) => {
    const content = output.innerHTML;
    let blob, url, a;

    if (type === 'txt') {
        blob = new Blob([output.innerText], { type: 'text/plain' });
        url = URL.createObjectURL(blob);
        a = document.createElement('a');
        a.href = url;
        a.download = 'document.txt';
    } else if (type === 'pdf') {
        const pdfWindow = window.open('', '', 'width=800,height=600');
        pdfWindow.document.write(`<html><head><title>Document</title></head><body>${content}</body></html>`);
        pdfWindow.document.close();
        pdfWindow.print();
        return;
    }

    a.click();
    URL.revokeObjectURL(url);
};

const toggleSaveOptions = () => {
    const saveOptions = document.getElementById('saveOptions');
    saveOptions.style.display = saveOptions.style.display === 'flex' ? 'none' : 'flex';
};

const createSaveOptions = () => {
    const saveOptions = document.createElement('div');
    saveOptions.id = 'saveOptions';
    saveOptions.classList.add('save-options');

    const saveTxtButton = document.createElement('button');
    saveTxtButton.classList.add('tool--btn');
    saveTxtButton.innerHTML = '<i class="fas fa-file-alt"></i> Salvar como .txt';
    saveTxtButton.addEventListener('click', () => saveContent('txt'));

    const savePdfButton = document.createElement('button');
    savePdfButton.classList.add('tool--btn');
    savePdfButton.innerHTML = '<i class="fas fa-file-pdf"></i> Salvar como .pdf';
    savePdfButton.addEventListener('click', () => saveContent('pdf'));

    if (!document.querySelector('.save-options')) {
        saveOptions.appendChild(saveTxtButton);
        saveOptions.appendChild(savePdfButton);
        document.querySelector('.save-container').appendChild(saveOptions);
    }
};

const updateCounters = () => {
    const text = output.innerText;
    charCount.textContent = `${text.length} caracteres`;
    wordCount.textContent = `${text.trim().split(/\s+/).filter(word => word.length > 0).length} palavras`;
};

output.addEventListener('input', updateCounters);
createSaveOptions();
