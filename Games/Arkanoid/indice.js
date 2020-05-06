document.getElementById("controles").textContent = "Controles: " + infoJuegos.Arkanoid.Controles;
document.getElementById("explicacion").textContent = infoJuegos.Arkanoid.Explicacion;
document.getElementById("modalGuardar").addEventListener("click", function () {
    let nombre = document.getElementById("nombre");
    if (nombre.hasAttribute("class", "is-invalid")) {
        nombre.classList.remove("is-invalid");
        if (nombre.value == "") {
            nombre.classList.add("is-invalid");
        } else {
            if ($('#mensaje').text() !== "Tu puntuación ya ha sido guardada.") {
                nombre.classList.add("is-valid");
                let puntuacion = document.getElementById("numeroPuntuacion").textContent;
                puntuacion = parseInt(puntuacion);
                let puntuaciones = JSON.parse(localStorage.getItem("Arkanoid"));
                console.log(puntuaciones);
                puntuaciones.push({ nombre: nombre.value, puntuacion: puntuacion });
                console.log(puntuaciones);
                localStorage.setItem("Arkanoid", JSON.stringify(puntuaciones));
                $('#mensaje').text("Tu puntuación ya ha sido guardada.");
                $('#modalPuntuacion').modal('hide');
            }

        }
    }
});
