const { ipcRenderer } = require('electron');
let nombreJuego;
ipcRenderer.on('juego', (evt, juego) => {
    creacionTabla(juego);
    document.getElementById("tituloJuego").textContent = juego;
});

function creacionTabla(juego) {
    let objeto = JSON.parse(localStorage.getItem(juego));
    if (!objeto) {
        $('body').empty();
        $(`<div class="alert alert-secondary text-center">
                ${juego} sin puntuaciones previas
                </div>'`).appendTo($('body'));
    } else {
        objeto.sort((a, b) => {
            if (a.puntuacion > b.puntuacion) {
                return -1;
            } else if (a.puntuacion < b.puntuacion) {
                return 1;
            } else {
                return 0;
            }
        });
        let tabla = document.getElementById("tabla");
        $(`<tr class="table-dark tableFixHead"><th scope="col"></th><th scope="col">Nombre</th><th scope="col">Puntuación</th></tr>`).appendTo("#tabla");
        $("<tbody></tbody>").appendTo("#tabla");
        for (let i = 1; i < objeto.length + 1; i++) {
            if (i == 1) {
                $(`<tr class="table-success"><th scope="row">${i}º</th><td>${objeto[i - 1].nombre}</td><td>${objeto[i - 1].puntuacion}</td></tr>`).appendTo("tbody");
            } else if (i == 2) {
                $(`<tr class="table-primary"><th scope="row">${i}º</th><td>${objeto[i - 1].nombre}</td><td>${objeto[i - 1].puntuacion}</td></tr>`).appendTo("tbody");
            } else if (i == 3) {
                $(`<tr class="table-info"><th scope="row">${i}º</th><td>${objeto[i - 1].nombre}</td><td>${objeto[i - 1].puntuacion}</td></tr>`).appendTo("tbody");
            } else {
                $(`<tr><th scope="row">${i}º</th><td>${objeto[i - 1].nombre}</td><td>${objeto[i - 1].puntuacion}</td></tr>`).appendTo("tbody");
            }
        }
    }
}