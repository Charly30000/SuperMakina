console.log("Cargar Juego");
function cargarJuego(rutaJuego) {
    let fs = require('fs');
    let path = require('path');
    let ruta = path.join(__dirname, rutaJuego);
    console.log(ruta);
    fs.readFile(ruta, function (error, datos) {
        let container = document.getElementById("contenedor");
        container.innerHTML = datos;
    });
}
