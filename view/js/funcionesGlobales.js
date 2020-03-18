function cargarJuego(rutaJuego) {
    let fs = require('fs');
    let path = require('path');
    let ruta = path.join(__dirname, rutaJuego);
    fs.readFile(ruta, function (error, datos) {
        let container = document.getElementById("contenedor");
        container.innerHTML = datos;
    });
}
