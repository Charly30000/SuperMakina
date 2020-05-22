// funcionalidad botones -> añade la información del fichero infoJuegos al modal
let botonDescripcionPuzzleBobble = document.getElementById("botonDescripcionPuzzleBobble");
let botonDescripcionArkanoid = document.getElementById("botonDescripcionArkanoid");
botonDescripcionPuzzleBobble.addEventListener("click", function () {
  document.getElementById("tituloJuego").textContent = infoJuegos.PuzzleBobble.Titulo;
  document.getElementById("descripcionJuego").textContent = infoJuegos.PuzzleBobble.Descripcion;
  document.getElementById("modalBotonJugar").href = `../Games/${infoJuegos.PuzzleBobble.Titulo}/index.html`;
});
botonDescripcionArkanoid.addEventListener("click", function () {
  document.getElementById("tituloJuego").textContent = infoJuegos.Arkanoid.Titulo;
  document.getElementById("descripcionJuego").textContent = infoJuegos.Arkanoid.Descripcion;
  document.getElementById("modalBotonJugar").href = `../Games/${infoJuegos.Arkanoid.Titulo}/index.html`;
});

// boton puntuaciones
const { ipcRenderer } = require('electron');

let botonPuntuacionesPuzzleBobble = document.getElementById("botonPuntuacionesPuzzleBobble");
botonPuntuacionesPuzzleBobble.addEventListener("click", function () {
  let juego = infoJuegos.PuzzleBobble.Titulo;
  ipcRenderer.send('puntuaciones', juego);
})

let botonPuntuacionesArkanoid = document.getElementById("botonPuntuacionesArkanoid");
botonPuntuacionesArkanoid.addEventListener("click", function () {
  let juego = infoJuegos.Arkanoid.Titulo;
  ipcRenderer.send('puntuaciones', juego);
})