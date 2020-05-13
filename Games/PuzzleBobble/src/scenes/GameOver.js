class GameOver extends Phaser.Scene {
    constructor() {
        super({ key: "GameOver" })
    }


    create() {
        this.add.text(20, 20, `Puntos: ${gameConfig.puntos}`);
        var puntuaciones = JSON.parse(localStorage.getItem("PuzzleBobble"));
        puntuaciones.push({ nombre: "Nuevo!", puntuacion: gameConfig.puntos })
        puntuaciones.sort((a, b) => {
            if (a.puntuacion > b.puntuacion) {
                return -1;
            } else if (a.puntuacion < b.puntuacion) {
                return 1;
            } else {
                return 0;
            }
        });

        var posY = 80;
        var posicionTabla = 1;
        this.posNuevo;
        puntuaciones.forEach(puntuacion => {
            if (puntuacion.nombre === "Nuevo!") {
                if (posicionTabla == 11) {
                    this.add.text(20, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString().padEnd(15, ".")}${puntuacion.puntuacion}`, { color: '#E74C3C' });
                } else {
                    this.add.text(20, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString().padEnd(15, ".")}${puntuacion.puntuacion}`, { color: '#2E86C1' });
                }
                this.posNuevo = posicionTabla;
            } else if (posicionTabla == 11) {
                this.add.text(20, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString().padEnd(15, ".")}${puntuacion.puntuacion}`, { color: '#E74C3C' });
            } else {
                this.add.text(20, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString().padEnd(15, ".")}${puntuacion.puntuacion}`);
            }
            posY += 40;
            posicionTabla++;
        });
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.text(20, config.height - 50, "Press Space to continue....");
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if (this.posNuevo != 11) {
                // Si ha metido un nombre correcto y se ha guardado su puntuación
                if ($('#nombre').hasClass("is-valid")) {
                    $('#nombre').removeClass("is-valid");
                    $('#nombre').addClass("is-invalid");
                    $('#nombre').val("");
                    this.scene.start("Scene_play");
                    this.scene.stop();
                    gameConfig.puntos = 0;
                } else {
                    // Muestra el modal y guarda las puntuaciones
                    $('#numeroPuntuacion').text(gameConfig.puntos);
                    $('#modalPuntuacion').modal('show');
                }
            } else {
                // Se reinicia el juego
                this.scene.start("Scene_play");
                this.scene.stop();
                gameConfig.puntos = 0;
            }
        }
    }
}