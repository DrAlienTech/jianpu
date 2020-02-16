const electron = require('electron');
const { ipcRenderer } = electron;

const ul = document.querySelector('ul');

const form = document.querySelector('form');

function submitForm(e) {
    e.preventDefault();

    const name = document.querySelector('#name').value;

    ipcRenderer.send('item:add', name);
};

ipcRenderer.on('item:add', function (e, name) {
    const li = document.createElement('li');
    const itemText = document.createTextNode(name);
    li.appendChild(itemText);
    ul.appendChild(li);
});

ipcRenderer.on('item:clear', function (e, name) {
    ul.innerHTML = "";
});

ul.addEventListener('dblclick', removeFile);

function removeFile(e) {
    e.target.remove();
}