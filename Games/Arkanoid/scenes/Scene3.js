class Scene3 extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }

    create() {
        this.add.image(200, 300, "Escena3");
        this.add.text(config.width / 2, 45, `Puntos: ${gameConfig.puntos}`, { fontFamily: 'Rockwell', fontSize: 30, color: '#000000'}).setOrigin(0.5, 0.5);
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

        var posY = 95;
        var posicionTabla = 1;
        this.posNuevo;
        puntuaciones.forEach(puntuacion => {
            if (puntuacion.nombre === "Nuevo!") {
                if (posicionTabla == 11) {
                    this.add.text(35, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString()}`, { fontFamily: 'Rockwell', color: '#bf0000'});
                    this.add.text(250, posY, `${puntuacion.puntuacion}`, { fontFamily: 'Rockwell', color: '#bf0000'});
                } else {
                    this.add.text(35, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString()}`, { fontFamily: 'Rockwell', color: '#0000c2'});
                    this.add.text(250, posY, `${puntuacion.puntuacion}`, { fontFamily: 'Rockwell', color: '#0000c2'});
                }
                this.posNuevo = posicionTabla;
            } else if (posicionTabla == 11) {
                this.add.text(35, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString()}`, { fontFamily: 'Rockwell', color: '#bf0000'});
                this.add.text(250, posY, `${puntuacion.puntuacion}`, { fontFamily: 'Rockwell', color: '#bf0000'});
            } else {
                this.add.text(35, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString()}`, { fontFamily: 'Rockwell', color: '#000000'});
                this.add.text(250, posY, `${puntuacion.puntuacion}`, { fontFamily: 'Rockwell', color: '#000000'});
                
            }
            posY += 39;
            posicionTabla++;
        });
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        if (gameConfig.haGanado) {
            gameConfig.haGanado = false;
        }
        this.intervalPressSpace = setInterval(() => {
            let imgPressSpace = this.add.image(config.width / 2, 550, "pressSpace").setScale(1.2);
            setTimeout(() => {
                imgPressSpace.destroy();
            }, 1000);
        }, 2000);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if (this.posNuevo != 11) {
                // Si ha metido un nombre correcto y se ha guardado su puntuación
                if ($('#nombre').hasClass("is-valid")) {
                    clearInterval(this.intervalPressSpace);
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
                clearInterval(this.intervalPressSpace);
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