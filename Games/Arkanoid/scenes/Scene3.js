class Scene3 extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }

    create() {
        this.add.image(200, 300, "Escena3");
        this.add.text(120, 40, `Puntos: ${gameConfig.puntos}`, { fontFamily: 'monospace', fontSize: 20});
        /* localStorage.setItem("Arkanoid", JSON.stringify(
            [
                { "nombre": "alb", "puntuacion": 123123123 }, 
                { "nombre": "nbc", "puntuacion": 242352 }, 
                { "nombre": "san", "puntuacion": 123312 }, 
                { "nombre": "dfb", "puntuacion": 13123 }, 
                { "nombre": "mjm", "puntuacion": 6573 },
                { "nombre": "mjm", "puntuacion": 6573 },
                { "nombre": "mjm", "puntuacion": 6573 },
                { "nombre": "mjm", "puntuacion": 6573 },
                { "nombre": "asd", "puntuacion": 5673 }
            ]
        )); */
        var puntuaciones = JSON.parse(localStorage.getItem("Arkanoid"));
        puntuaciones.push({ nombre: "Nuevo!", puntuacion: gameConfig.puntos });
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
                    this.add.text(20, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString().padEnd(15, ".")}${puntuacion.puntuacion}`, { fontFamily: 'monospace', color: '#000000'});
                } else {
                    this.add.text(20, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString().padEnd(15, ".")}${puntuacion.puntuacion}`, { fontFamily: 'monospace', color: '#ff2e35'});
                }
                this.posNuevo = posicionTabla;
            } else if (posicionTabla == 11) {
                this.add.text(20, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString().padEnd(15, ".")}${puntuacion.puntuacion}`, { fontFamily: 'monospace', color: '#000000'});
            } else {
                this.add.text(20, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString().padEnd(15, ".")}${puntuacion.puntuacion}`, { fontFamily: 'monospace' });
            }
            posY += 40;
            posicionTabla++;
        });
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        if (gameConfig.haGanado) {
            gameConfig.haGanado = false;
        }
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if (this.posNuevo != 11) {
                // Si ha metido un nombre correcto y se ha guardado su puntuación
                if ($('#nombre').hasClass("is-valid")) {
                    $('#nombre').removeClass("is-valid");
                    $('#nombre').addClass("is-invalid");
                    $('#nombre').val("");
                    this.scene.start("playGame");
                    this.scene.stop();
                    gameConfig.puntos = 0;
                    if (sonidoGana.isPlaying) {
                        sonidoGana.stop();
                    }
                } else {
                    // Muestra el modal y guarda las puntuaciones
                    $('#numeroPuntuacion').text(gameConfig.puntos);
                    $('#modalPuntuacion').modal('show');
                }
            } else {
                // Se reinicia el juego
                this.scene.start("playGame");
                this.scene.stop();
                gameConfig.puntos = 0;
                if (sonidoGana.isPlaying) {
                    sonidoGana.stop();
                }
            }

        }
    }
}