class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        // Seleccion de nivel
        var cargaNivel;
        switch (gameConfig.nivel) {
            case 1:
                cargaNivel = level_1;
                break;
            case 2:
                cargaNivel = level_2;
                break;
            case 3:
                cargaNivel = level_3;
                break;
            case 4:
                cargaNivel = level_4;
                break;
            case 5:
                cargaNivel = level_5;
                break;
            case 6:
                cargaNivel = level_6;
                break;
            case 7:
                cargaNivel = level_7;
                break;
            case 8:
                cargaNivel = level_8;
                break;
            case 9:
                cargaNivel = level_9;
                break;
            case 10:
                cargaNivel = level_10;
                break;
            default:
                gameConfig.nivel = 1;
                cargaNivel = level_1;
                break;
        }

        // Colocacion del fondo
        /************** 
            POR HACER
        ***************/

        // Colocacion de barras
        this.listaBarras = this.physics.add.staticGroup();
        this.listaBarras.add(this.add.sprite(30, 48, "barra_arriba").setOrigin(0, 0));
        this.barraLateralIzda = this.add.sprite(0, 68, "barra_lateralizda").setOrigin(0, 0);
        this.listaBarras.add(this.barraLateralIzda);
        this.barraLateralDcha = this.add.sprite(376, 68, "barra_lateraldcha").setOrigin(0, 0);
        this.listaBarras.add(this.barraLateralDcha);
        this.add.sprite(366, 49, "barra_girodcha").setOrigin(0, 0);
        this.add.sprite(0, 49, "barra_giroizda").setOrigin(0, 0);

        // Parte de las puntuaciones
        var graphics = this.add.graphics();
        graphics.fillStyle("Black");
        graphics.fillRect(0, 0, config.width, 48);
        this.scoreLabel = this.add.text(16, 8, `SCORE: ${this.zeroPad(gameConfig.puntos, 6)}`);
        this.vidasLabel = this.add.text(16, 28, `Vidas: ${gameConfig.vidas}`);
        this.nivelLabel = this.add.text(config.width - 100, 28, `Nivel: ${gameConfig.nivel}`);

        // Sistema de colocacion de ladrillos por el nivel
        var posX = 40;
        var posY = 80;
        this.listaLadrillos = this.add.group();
        this.listaLadrillosIndestructibles = this.add.group();
        this.listaLadrillosRegenerativos = this.add.group();
        this.listaLadrillosDuros = this.add.group();
        cargaNivel.ladrillos.forEach(arrayLadrillos => {
            arrayLadrillos.forEach(element => {
                if (element.ladrillo) {
                    switch (element.ladrillo) {
                        case "ladrillo_indestructible":
                            this.listaLadrillosIndestructibles.add(
                                new LadrilloIndestructible(this, posX, posY, element.ladrillo,
                                    element.movement));
                            break;
                        case "ladrillo_regenerativo":
                            this.listaLadrillosRegenerativos.add(
                                new LadrilloRegenerativo(this, posX, posY, element.ladrillo,
                                    element.movement));
                            break;
                        case "ladrillo_duro":
                            this.listaLadrillosDuros.add(
                                new LadrilloDuro(this, posX, posY, element.ladrillo, element.movement));
                            break;
                        default:
                            this.listaLadrillos.add(
                                new Ladrillo(this, posX, posY, element.ladrillo, element.movement));
                            break;
                    }
                }
                posX += 32;
            });
            posX = 40;
            posY += 16;
        });

        // Pelotas
        this.listaPelotas = this.add.group();
        this.listaPelotas.add(
            new Pelota(this, gameConfig.posicionPelotaX, gameConfig.posicionPelotaY, "bola_blanca"));
        // Jugador
        this.listaJugador = this.add.group();
        this.listaJugador.add(
            new Jugador(this, gameConfig.posicionJugadorX, gameConfig.posicionJugadorY, "jugador_normal"));

        /**************** 
            COLISIONES
        *****************/
        //Colision con izquierda, derecha, arriba, abajo
        this.physics.world.setBoundsCollision(true, true, true, false);
        // Colision pelota - ladrillos
        this.physics.add.collider(this.listaPelotas, this.listaLadrillos,
            this.colisionPelotaLadrillo, null, this);
        // Colision pelota - ladrillos indestructibles
        this.physics.add.collider(this.listaPelotas, this.listaLadrillosIndestructibles,
            this.colisionPelotaLadrilloIndestructible, null, this);
        // Colision pelota - ladrillos regenerativos
        this.physics.add.collider(this.listaPelotas, this.listaLadrillosRegenerativos,
            this.colisionPelotaLadrilloRegenerativo,
            function (pelota, ladrillo) {
                ladrillo.golpes -= 1;
                console.log("Golpes restantes del ladrillo regenerativo: " + ladrillo.golpes)
                if (ladrillo.golpes > 0) {
                    return true;
                }
                return false;
            }, this);

        this.physics.add.overlap(this.listaPelotas, this.listaLadrillosRegenerativos,
            this.overlapPelotaLadrilloRegenerativo,
            function (pelota, ladrillo) {
                if (ladrillo.golpes <= 0) {
                    return true;
                }
                return false;
            }, this);
        // Colision pelota - ladrillos duros
        this.physics.add.collider(this.listaPelotas, this.listaLadrillosDuros,
            this.colisionPelotaLadrilloDuro, null, this);
        // Colision pelota - barras
        this.physics.add.collider(this.listaPelotas, this.listaBarras, this.colisionPelotaBarras, null, this);
        // Colision pelota - jugador
        this.physics.add.collider(this.listaPelotas, this.listaJugador, this.colisionPelotaJugador, null, this);
        // Colision jugador - barras
        this.physics.add.collider(this.listaJugador, this.listaBarras);

        /************
            SONIDOS
        *************/
        // Añado los sonidos....
        this.click = this.sound.add("efecto_click");

        /************
            TECLADO
        *************/
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Linea a borrar debido a que es para ver donde hacer el cambio de rumbo de la pelota
        /* this.graphicos = this.add.graphics(); */
    }

    update() {
        /* 
            Para cambiar de nivel:
            nivel += 1;
            this.scene.restart();
        */

        // Activador del update de los ladrillos
        /* this.listaLadrillos.getChildren().forEach(ladrillo => {
            ladrillo.update();
        }); */
        this.listaPelotas.getChildren().forEach(pelota => {
            pelota.update();
        });

        // Añadimos el movimiento del jugador
        this.movimientoJugador();
        // Hago que si la pelota está por empezar en el juego, se pueda disparar
        // Funciona en caso de que empiece la partida o el jugador pierda una vida
        if (gameConfig.inicioPelota) {
            if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
                gameConfig.inicioPelota = false;
                this.listaPelotas.getChildren().forEach(pelota => {
                    pelota.body.velocity.set(
                        Phaser.Math.Between(gameConfig.velocidadJugadorX * -1, gameConfig.velocidadJugadorX),
                        gameConfig.velocidadPelotaY);
                });
            }
        }
        if (this.cursorKeys.up.isDown) {
            gameConfig.vidas += 1;
            this.vidasLabel.text = `Vidas: ${gameConfig.vidas}`;
        }

        /* --------------------------------------------------------------------------------------- */
        /* A borrar en cuanto se termine de hacer la decision del cambio de direccion de la pelota */
        /* this.graphicos.clear();
        this.listaJugador.getChildren().forEach(jugador => {
            // Parte izda amarillo
            this.graphicos.fillStyle(0xfcd422);
            this.graphicos.fillRect(jugador.body.x, jugador.body.y, 7, 4);
            // Parte dcha amarillo
            this.graphicos.fillRect(jugador.body.x + jugador.body.width, jugador.body.y, -7, 4);

        }); */
        /* --------------------------------------------------------------------------------------- */

    }

    colisionPelotaLadrillo(pelota, ladrillo) {
        this.reponerVelocidadPelota(pelota);
        ladrillo.destroy();
        this.click.play();
        this.aumentarPuntos(ladrillo);
        // Sistema de cambio de nivel
        this.comprobarCambiarNivel();
    }

    colisionPelotaLadrilloIndestructible(pelota, ladrillo) {
        this.reponerVelocidadPelota(pelota);
        this.click.play();
    }

    colisionPelotaLadrilloRegenerativo(pelota, ladrillo) {
        this.reponerVelocidadPelota(pelota);
        this.click.play();
    }

    overlapPelotaLadrilloRegenerativo(pelota, ladrillo) {
        let posX = ladrillo.body.x;
        let posY = ladrillo.body.y;
        let movement = ladrillo.movement;
        this.aumentarPuntos(ladrillo);
        ladrillo.destroy();
        this.time.addEvent({
            delay: 1000,
            callback: this.reponerLadrilloRegenerativo,
            callbackScope: this,
            loop: false,
            args: [posX, posY, movement]
        });
    }

    colisionPelotaLadrilloDuro(pelota, ladrillo) {
        this.reponerVelocidadPelota(pelota);
        this.click.play();
        ladrillo.golpes -= 1;
        if (ladrillo.golpes <= 0) {
            ladrillo.destroy();
        }
        this.aumentarPuntos(ladrillo);
        this.comprobarCambiarNivel();
    }

    /**
     * Este metodo unicamente repone la velocidad de la pelota en caso de que su velocidad en Y cambie.
     * Este metodo ha sido creado debido a que cuando la pelota choca con varios objetos simultaneamente,
     * esta, por el funcionamiento de Phaser, hace que se reduzca su velocidad.
     * La velocidad en X si se modifica, pero no es cambiada ya que no parece afectar al funcionamiento 
     * normal del juego, unicamente le da un efecto más realista
     * @param {*} pelota Pasar el objeto de la pelota para reponerle la velocidad original marcada
     */
    reponerVelocidadPelota(pelota) {
        // Comprobacion para que no supere la velocidad en Y
        if (pelota.body.velocity.y > 0) {
            pelota.body.velocity.y = gameConfig.velocidadPelotaY * -1;
        } else if (pelota.body.velocity.y <= 0) {
            pelota.body.velocity.y = gameConfig.velocidadPelotaY;
        }
        // Comprobacion para que no supere la velocidad en X del jugador
        if (pelota.body.velocity.x > gameConfig.velocidadJugadorX) {
            pelota.body.velocity.x = gameConfig.velocidadJugadorX;
        } else if (pelota.body.velocity.x < gameConfig.velocidadJugadorX * -1) {
            pelota.body.velocity.x = gameConfig.velocidadJugadorX * -1;
        }

        if (pelota.body.velocity.x < gameConfig.velocidadMinimaPelotaX && pelota.body.velocity.x > 0) {
            pelota.body.velocity.x = gameConfig.velocidadMinimaPelotaX;
        } else if (pelota.body.velocity.x > -gameConfig.velocidadMinimaPelotaX && pelota.body.velocity.x <= 0) {
            pelota.body.velocity.x = -gameConfig.velocidadMinimaPelotaX;
        }
    }

    colisionPelotaBarras(pelota, barra) {
        this.reponerVelocidadPelota(pelota);
    }

    colisionPelotaJugador(pelota, jugador) {
        if (jugador.body.touching.up) {
            if (pelota.body.x + (pelota.body.width / 2) < jugador.body.x + (jugador.body.width / 2)) {
                console.log("Toca en la IZDA del jugador");
                if (pelota.body.velocity.x > 0) {
                    console.log("voy a la dcha");
                    if ((pelota.body.x + (pelota.body.width / 2)) < jugador.body.x + 7 /* Zona naranja lado izdo */) {
                        pelota.body.velocity.x *= -1
                    } else {
                        // Sumo 40 y resto 40 en todos para que haya una diferencia notable en su cambio de direccion
                        pelota.body.velocity.x = pelota.body.velocity.x + (pelota.body.x - jugador.body.x)
                            + Phaser.Math.Between(30, 45);
                    }
                } else {
                    console.log("voy a la izda");
                    pelota.body.velocity.x = pelota.body.velocity.x - (pelota.body.x - jugador.body.x)
                        - Phaser.Math.Between(30, 45);
                }

            } else {
                console.log("Toca en la DCHA del jugador");
                if (pelota.body.velocity.x > 0) {
                    console.log("voy a la dcha");
                    pelota.body.velocity.x = pelota.body.velocity.x -
                        (pelota.body.x - jugador.body.x - jugador.body.width)
                        - Phaser.Math.Between(30, 45);
                } else {
                    console.log("voy a la izda");
                    if ((pelota.body.x + (pelota.body.width / 2)) > (jugador.body.x + jugador.body.width - 7) /* Zona naranja lado dcho */) {
                        pelota.body.velocity.x *= -1;
                    } else {
                        pelota.body.velocity.x = pelota.body.velocity.x +
                            (pelota.body.x - jugador.body.x - jugador.body.width)
                            + Phaser.Math.Between(30, 45);
                    }
                }
            }
        }

        this.reponerVelocidadPelota(pelota);
        console.log(pelota.body.velocity.x)
    }

    movimientoJugador() {
        this.listaJugador.getChildren().forEach(jugador => {
            if (this.cursorKeys.left.isDown &&
                jugador.body.x > (this.barraLateralIzda.body.x + this.barraLateralIzda.body.width)) {
                jugador.body.setVelocityX(gameConfig.velocidadJugadorX * -1);
                // Funciona en caso de que empiece la partida o el jugador pierda una vida
                if (gameConfig.inicioPelota) {
                    this.listaPelotas.getChildren().forEach(pelota => {
                        pelota.body.velocity.x = gameConfig.velocidadJugadorX * -1;
                    });
                }
            } else if (this.cursorKeys.right.isDown &&
                (jugador.body.x + jugador.body.width) < this.barraLateralDcha.x) {
                jugador.body.setVelocityX(gameConfig.velocidadJugadorX);
                // Funciona en caso de que empiece la partida o el jugador pierda una vida
                if (gameConfig.inicioPelota) {
                    this.listaPelotas.getChildren().forEach(pelota => {
                        pelota.body.velocity.x = gameConfig.velocidadJugadorX;
                    });
                }
            } else {
                jugador.body.setVelocityX(0);
                // Funciona en caso de que empiece la partida o el jugador pierda una vida
                if (gameConfig.inicioPelota) {
                    this.listaPelotas.getChildren().forEach(pelota => {
                        pelota.body.velocity.x = 0;
                    });
                }
            }
        });
    }

    zeroPad(number, size) {
        let stringNumber = String(number);
        while (stringNumber.length < (size || 2)) {
            stringNumber = "0" + stringNumber;
        }
        return stringNumber;
    }

    quitarVida() {
        gameConfig.vidas -= 1;
        this.vidasLabel.text = `Vidas: ${gameConfig.vidas}`;
        if (gameConfig.vidas <= 0) {
            this.resetearJuego();
        }
    }

    resetearJuego() {
        gameConfig.vidas = 3;
        gameConfig.nivel = 1;
        gameConfig.puntos = 0;
        this.scene.restart();
    }

    /* Comprueba si los ladrillos que quedan, si no quedan ladrillos por destruir, cambia de nivel */
    comprobarCambiarNivel() {
        if (this.listaLadrillos.getLength() <= 0 && this.listaLadrillosDuros.getLength() <= 0) {
            gameConfig.nivel += 1;
            gameConfig.inicioPelota = true;
            this.scene.restart();
        }
    }

    reponerLadrilloRegenerativo(posX, posY, movement) {
        this.listaLadrillosRegenerativos.add(
            new LadrilloRegenerativo(this, posX, posY, "ladrillo_regenerativo", movement).setOrigin(0, 0));
    }

    aumentarPuntos(ladrillo) {
        gameConfig.puntos += ladrillo.puntos;
        let scoreFormated = this.zeroPad(gameConfig.puntos, 6);
        this.scoreLabel.text = `SCORE: ${scoreFormated}`;
    }

    /* 
        Funcion que elimina todos los objetos de la listaJugador y listaPelotas,
        generando asi un "inicio de juego", con una pelota y un jugador nuevos
        hecha principalmente para cuando el jugador pierde una vida
    */
    colocarPelotaYJugador() {
        gameConfig.inicioPelota = true;
        this.listaJugador.getChildren().forEach(jugador => {
            jugador.destroy();
        });

        this.listaPelotas.getChildren().forEach(pelota => {
            pelota.destroy();
        });

        this.listaPelotas.add(
            new Pelota(this, gameConfig.posicionPelotaX, gameConfig.posicionPelotaY, "bola_blanca"));
        this.listaJugador.add(
            new Jugador(this, gameConfig.posicionJugadorX, gameConfig.posicionJugadorY, "jugador_normal"));
    }
}