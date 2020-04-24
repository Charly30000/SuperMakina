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
        this.listaTodosLadrillos = this.add.group();
        this.listaMejoras = this.add.group();

        cargaNivel.ladrillos.forEach(arrayLadrillos => {
            arrayLadrillos.forEach(element => {
                if (element.ladrillo) {
                    let ladrillo;
                    switch (element.ladrillo) {
                        case "ladrillo_indestructible":
                            ladrillo = new LadrilloIndestructible(this, posX, posY, element.ladrillo,
                                element.movement);
                            this.listaLadrillosIndestructibles.add(ladrillo);
                            break;
                        case "ladrillo_regenerativo":
                            ladrillo = new LadrilloRegenerativo(this, posX, posY, element.ladrillo,
                                element.movement);
                            this.listaLadrillosRegenerativos.add(ladrillo);
                            break;
                        case "ladrillo_duro":
                            ladrillo = new LadrilloDuro(this, posX, posY, element.ladrillo, element.movement);
                            this.listaLadrillosDuros.add(ladrillo);
                            break;
                        default:
                            ladrillo = new Ladrillo(this, posX, posY, element.ladrillo, element.movement);
                            this.listaLadrillos.add(ladrillo);
                            break;
                    }
                    this.listaTodosLadrillos.add(ladrillo);
                    // Le pongo si el objeto va a tener mejora (si sale un numero entre 0-4 tendra mejora)
                    if (Math.floor(Math.random() * 11) < 4) {
                        ladrillo.tieneMejora = true;
                    }
                }
                posX += 32;
            });
            posX = 40;
            posY += 16;
        });

        // Hacer mover a los ladrillos desde el inicio si estos no tienen ladrillos a los lados
        /* Si el nivel solo tiene un ladrillo, y este tiene movimiento, no se va a mover */
        this.listaTodosLadrillos.getChildren().forEach(ladrillo => {
            if (ladrillo.movement) {
                // Obtengo el ladrillo de la izquierda segun el array de objetos
                let ladIzda = this.listaTodosLadrillos.getChildren()
                [this.listaTodosLadrillos.getChildren().indexOf(ladrillo) - 1];
                // Obtengo el ladrillo de la derecha segun el array de objetos
                let ladDcha = this.listaTodosLadrillos.getChildren()
                [this.listaTodosLadrillos.getChildren().indexOf(ladrillo) + 1];

                if (ladIzda && ladDcha) {
                    // Para el caso en el que tenga ladrillo izquierdo y derecho
                    if (ladIzda.body.y == ladrillo.body.y && ladDcha.body.y == ladrillo.body.y) {
                        // Para el caso de que tengan la misma altura
                        if (ladIzda.body.x != ladrillo.body.x - 32 || ladDcha.body.x != ladrillo.body.x + 32) {
                            this.movimientoLadrilloCargaJuego(ladrillo);
                        }
                    } else if (ladIzda.body.y != ladrillo.body.y && ladDcha.body.y == ladrillo.body.y) {
                        // Para el caso en el que el ladrillo de la izquierda tenga otra altura
                        if (ladrillo.body.x > 40) {
                            this.movimientoLadrilloCargaJuego(ladrillo);
                        }
                    } else if (ladIzda.body.y == ladrillo.body.y && ladDcha.body.y != ladrillo.body.y) {
                        // Para el caso en el que el ladrillo de la derecha tenga otra altura
                        if (ladrillo.body.x < 360) {
                            this.movimientoLadrilloCargaJuego(ladrillo);
                        }
                    }
                } else if (!ladIzda && ladDcha) {
                    // Si no tiene lado izquierdo pero si tiene lado derecho
                    if (ladrillo.body.x > 40) {
                        this.movimientoLadrilloCargaJuego(ladrillo);
                    }
                } else if (ladIzda && !ladDcha) {
                    // Si Tiene lado izquierdo pero no tiene lado derecho
                    if (ladrillo.body.x < 360) {
                        this.movimientoLadrilloCargaJuego(ladrillo);
                    }
                }
            }
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
        // Colision ladrillo - ladrillo
        this.physics.add.collider(this.listaTodosLadrillos, this.listaTodosLadrillos, this.colisionLadrilloLadrillo, null, this);
        // Colision ladrillo - barras
        this.physics.add.collider(this.listaTodosLadrillos, this.listaBarras, this.colisionLadrilloBarra, null, this);
        // Colision mejora - jugador
        this.physics.add.collider(this.listaMejoras, this.listaJugador, this.colisionMejoraJugador, null, this);
        /************
            SONIDOS
        *************/
        // Añado los sonidos....
        this.click = this.sound.add("efecto_click");
        this.inicioNivel = this.sound.add("musica_inicioNivel");
        //this.inicioNivel.play();

        /************
            TECLADO
        *************/
        this.cursorKeys = this.input.keyboard.createCursorKeys();
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    update() {
        // Actualizador de los objetos Pelota
        this.listaPelotas.getChildren().forEach(pelota => {
            pelota.update();
        });

        // Actualizador de los objetos Mejora
        this.listaMejoras.getChildren().forEach(mejora => {
            mejora.update();
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

    }

    colisionPelotaLadrillo(pelota, ladrillo) {
        this.reponerVelocidadPelota(pelota);
        this.hacerMoverseAlLadrillo(ladrillo);
        this.generarMejora(ladrillo);
        ladrillo.destroy();
        this.click.play();
        this.aumentarPuntos(ladrillo);
        // Sistema de cambio de nivel
        this.comprobarCambiarNivel();
    }

    colisionPelotaLadrilloIndestructible(pelota, ladrillo) {
        this.reponerVelocidadPelota(pelota);
        this.click.play();
        ladrillo.play("anim_ladrillo_indestructible");
    }

    colisionPelotaLadrilloRegenerativo(pelota, ladrillo) {
        this.reponerVelocidadPelota(pelota);
        this.click.play();
        if (ladrillo.golpes == 2) {
            ladrillo.setTexture("ladrillo_regenerativo_2");
        } else if (ladrillo.golpes == 1) {
            ladrillo.setTexture("ladrillo_regenerativo_3");
        }
    }

    overlapPelotaLadrilloRegenerativo(pelota, ladrillo) {
        let posX = ladrillo.body.x;
        let posY = ladrillo.body.y;
        let movement = ladrillo.movement;
        this.aumentarPuntos(ladrillo);
        this.generarMejora(ladrillo);
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
        if (ladrillo.golpes == 2) {
            ladrillo.setTexture("ladrillo_duro_2");
        } else if (ladrillo.golpes == 1) {
            ladrillo.setTexture("ladrillo_duro_3");
        }
        if (ladrillo.golpes <= 0) {
            this.aumentarPuntos(ladrillo);
            this.hacerMoverseAlLadrillo(ladrillo);
            this.generarMejora(ladrillo);
            ladrillo.destroy();
        }
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
        // Comprobacion para que la pelota no reduzca su velocidad en X del limite establecido
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
                //console.log("Toca en la IZDA del jugador");
                if (pelota.body.velocity.x > 0) {
                    //console.log("voy a la dcha");
                    if ((pelota.body.x + (pelota.body.width / 2)) < jugador.body.x + 7 /* Zona naranja lado izdo */) {
                        pelota.body.velocity.x *= -1
                    } else {
                        // Sumo 40 y resto 40 en todos para que haya una diferencia notable en su cambio de direccion
                        pelota.body.velocity.x = pelota.body.velocity.x + (pelota.body.x - jugador.body.x)
                            + Phaser.Math.Between(30, 45);
                    }
                } else {
                    //console.log("voy a la izda");
                    pelota.body.velocity.x = pelota.body.velocity.x - (pelota.body.x - jugador.body.x)
                        - Phaser.Math.Between(30, 45);
                }

            } else {
                //console.log("Toca en la DCHA del jugador");
                if (pelota.body.velocity.x > 0) {
                    //console.log("voy a la dcha");
                    pelota.body.velocity.x = pelota.body.velocity.x -
                        (pelota.body.x - jugador.body.x - jugador.body.width)
                        - Phaser.Math.Between(30, 45);
                } else {
                    //console.log("voy a la izda");
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
        //console.log(pelota.body.velocity.x)
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
        /* this.scene.stop();
        this.scene.start("bootGame") */
    }

    /* Comprueba los ladrillos que quedan, si no quedan ladrillos por destruir, cambia de nivel */
    comprobarCambiarNivel() {
        if (this.listaLadrillos.getLength() <= 0 && this.listaLadrillosDuros.getLength() <= 0) {
            gameConfig.nivel += 1;
            gameConfig.inicioPelota = true;
            this.scene.restart();
        }
    }

    reponerLadrilloRegenerativo(posX, posY, movement) {
        let ladrillo = new LadrilloRegenerativo(this, posX, posY, "ladrillo_regenerativo", movement)
        .setOrigin(0, 0).play("anim_ladrillo_regenerativo");
        this.listaLadrillosRegenerativos.add(ladrillo);
        this.listaTodosLadrillos.add(ladrillo);
    }

    aumentarPuntos(ladrillo) {
        gameConfig.puntos += ladrillo.puntos;
        let scoreFormated = this.zeroPad(gameConfig.puntos, 6);
        this.scoreLabel.text = `SCORE: ${scoreFormated}`;
    }

    /* 
        Funcion que elimina todos los objetos de la listaJugador y listaPelotas,
        generando asi un "inicio de juego", con una pelota y un jugador nuevos.
        Hecha principalmente para cuando el jugador pierde una vida
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

    /**
     * Esta funcion comprueba en la lista de los ladrillos, si tiene ladrillos a los lados,
     * si tiene ladrillos a los lados (independientemente de su distancia en x), estos empezaran
     * a moverse, siempre y cuando tengan la capacidad de moverse.
     * @param {*} ladrillo 
     */
    hacerMoverseAlLadrillo(ladrillo) {
        // Obtengo el ladrillo de la izquierda
        let ladIzda = this.listaTodosLadrillos.getChildren()
        [this.listaTodosLadrillos.getChildren().indexOf(ladrillo) - 1];
        // Obtengo el ladrillo de la derecha
        let ladDcha = this.listaTodosLadrillos.getChildren()
        [this.listaTodosLadrillos.getChildren().indexOf(ladrillo) + 1];

        if (ladIzda) {
            if (ladIzda.body.y == ladrillo.body.y && ladIzda.movement && !ladIzda.body.velocity.x) {
                if (ladIzda.body.x >= config.width / 2) {
                    ladIzda.body.velocity.x = 60;
                } else {
                    ladIzda.body.velocity.x = -60;
                }
            }
        }

        if (ladDcha) {
            if (ladDcha.body.y == ladrillo.body.y && ladDcha.movement && !ladDcha.body.velocity.x) {
                if (ladDcha.body.x >= config.width / 2) {
                    ladDcha.body.velocity.x = 60;
                } else {
                    ladDcha.body.velocity.x = -60;
                }
            }
        }
    }

    colisionLadrilloLadrillo(ladrillo1, ladrillo2) {
        if (ladrillo1.movement) {
            ladrillo1.body.velocity.x *= -1;
        }
    }

    colisionLadrilloBarra(ladrillo, barra) {
        if (ladrillo.movement) {
            ladrillo.body.velocity.x *= -1;
        }
    }

    movimientoLadrilloCargaJuego(ladrillo) {
        if (ladrillo.body.x >= config.width / 2) {
            ladrillo.body.velocity.x = 60;
        } else {
            ladrillo.body.velocity.x = -60;
        }
    }

    generarMejora(ladrillo) {
        if (ladrillo.tieneMejora) {
            let xMejora = ladrillo.body.x + (ladrillo.body.width / 2);
            let yMejora = ladrillo.body.y + ladrillo.body.height;
            let mejora;
            let numeroRandom = Math.floor(Math.random() * 8);
            switch (numeroRandom) {
                case 0:
                    // Mejora roja - maximizar
                    mejora = "mejora_roja";
                    break;
                case 1:
                    // Mejora azul - minimizar
                    mejora = "mejora_azul";
                    break;
                case 2:
                    // Mejora blanca - multiple
                    mejora = "mejora_blanca";
                    break;
                case 3:
                    // Mejora naranja - bola roja
                    mejora = "mejora_naranja";
                    break;
                case 4:
                    // Mejora verde - pegajoso
                    mejora = "mejora_verde";
                    break;
                case 5:
                    // Mejora negra - pistolero
                    mejora = "mejora_negra";
                    break;
                case 6:
                    // Mejora fucsia - multipaleta
                    mejora = "mejora_fucsia";
                    break;
                default:
                    // Si no se llegase a generar un numero adecuado, se genera la mejora roja por defecto
                    mejora = "mejora_roja";
                    console.log("ha pasado por el default en la seleccion")
                    break;
            }
            this.listaMejoras.add(new Mejora(this, xMejora, yMejora, mejora)
                .setOrigin(0.5, 0).setScale(1.5));
        }
    }

    colisionMejoraJugador(mejora, jugador) {
        if (this.listaJugador.getChildren()[1]) {
            this.listaJugador.getChildren()[1].destroy();
        }
        this.listaJugador.getChildren()[0].modoPegajoso = false;
        this.listaJugador.getChildren()[0].modoPistolero = false;
        this.listaJugador.getChildren()[0].modoMultipaleta = false;
        this.listaJugador.getChildren()[0].modoMaximizar = false;
        this.listaJugador.getChildren()[0].modoMinimizar = false;
        if (this.listaJugador.getChildren()[0].mejoraActual !== mejora.texture.key) {
            this.listaJugador.getChildren()[0].mejoraActual = mejora.texture.key;
            switch (mejora.texture.key) {
                case "mejora_roja":
                    // Mejora roja - maximizar
                    this.listaJugador.getChildren()[0].modoMaximizar = true;
                    
                    break;
                case "mejora_azul":
                    // Mejora azul - minimizar
                    this.listaJugador.getChildren()[0].modoMinimizar = true;
                    
                    break;
                case "mejora_blanca":
                    // Mejora blanca - multiple
                    
                    break;
                case "mejora_naranja":
                    // Mejora naranja - bola roja
                    
                    break;
                case "mejora_verde":
                    // Mejora verde - pegajoso
                    this.listaJugador.getChildren()[0].modoPegajoso = true;
                    
                    break;
                case "mejora_negra":
                    // Mejora negra - pistolero
                    this.listaJugador.getChildren()[0].modoPistolero = true;
                    
                    break;
                case "mejora_fucsia":
                    // Mejora fucsia - multipaleta
                    this.listaJugador.getChildren()[0].modoMultipaleta = true;
                    
                    break;
                default:
                    // Si no se llegase a generar un numero adecuado, se genera la mejora roja por defecto
                    this.listaJugador.getChildren()[0].mejoraActual = "mejora_roja";
                    console.log("Ha pasado por el default")
                    break;
            }
        }
        mejora.destroy();
    }
}