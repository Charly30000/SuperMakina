document.getElementById("controles").textContent = "Controles: " + infoJuegos.PuzzleBobble.Controles;
document.getElementById("explicacion").textContent = infoJuegos.PuzzleBobble.Explicacion;
document.getElementById("modalGuardar").addEventListener("click", function () {
    let nombre = document.getElementById("nombre");
    if (nombre.hasAttribute("class", "is-invalid")) {
        nombre.classList.remove("is-invalid");
        $('#error').text("");
        if (nombre.value == "" || nombre.value.length >= 4) {
            nombre.classList.add("is-invalid");
            nombre.value = "";
            $('#error').text("Nombre con 3 caracteres");
        } else {
            if ($('#mensaje').text() !== "Tu puntuación ya ha sido guardada.") {
                nombre.classList.add("is-valid");
                let puntuacion = document.getElementById("numeroPuntuacion").textContent;
                puntuacion = parseInt(puntuacion);
                let puntuaciones = JSON.parse(localStorage.getItem("PuzzleBobble"));
                if (puntuaciones) {
                    puntuaciones.push({ nombre: nombre.value, puntuacion: puntuacion });
                } else {
                    puntuaciones = [
                        { nombre: nombre.value, puntuacion: puntuacion }, 
                    ]
                }
                if (puntuaciones.length == 11) {
                    puntuaciones.sort((a, b) => {
                        if (a.puntuacion > b.puntuacion) {
                            return -1;
                        } else if (a.puntuacion < b.puntuacion) {
                            return 1;
                        } else {
                            return 0;
                        }
                    });
                    puntuaciones.pop();
                }
                localStorage.setItem("PuzzleBobble", JSON.stringify(puntuaciones));
                $('#mensaje').text("Tu puntuación ya ha sido guardada.");
                $('#modalPuntuacion').modal('hide');
            }

        }
    }
});