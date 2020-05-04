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
        this.add.image(200, 360, cargaNivel.background);

        // Colocacion de barras
        this.listaBarras = this.physics.add.staticGroup();
        this.barraArriba = this.add.sprite(30, 48, "barra_arriba").setOrigin(0, 0);
        this.listaBarras.add(this.barraArriba);
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
        this.scoreLabel = this.add.text(16, 8, `SCORE: ${this.zeroPad(gameConfig.puntos, 7)}`);
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
        // Misiles
        this.listaMisiles = this.add.group();

        /**************** 
            COLISIONES
        *****************/
        //Colision con izquierda, derecha, arriba, abajo
        this.physics.world.setBoundsCollision(true, true, true, false);
        // Colision pelota - ladrillos
        this.physics.add.collider(this.listaPelotas, this.listaLadrillos,
            this.colisionPelotaLadrillo, function (pelota, ladrillo) {
                return this.comprobarBolaRoja(pelota, ladrillo);
            }, this);
        this.physics.add.overlap(this.listaPelotas, this.listaLadrillos,
            this.overlapPelotaLadrillo, function (pelota, ladrillo) {
                return this.comprobarOverlapBolaRoja(pelota, ladrillo);
            }, this);

        // Colision pelota - ladrillos indestructibles
        this.physics.add.collider(this.listaPelotas, this.listaLadrillosIndestructibles,
            this.colisionPelotaLadrilloIndestructible, function (pelota, ladrillo) {
                return this.comprobarBolaRoja(pelota, ladrillo);
            }, this);
        this.physics.add.overlap(this.listaPelotas, this.listaLadrillosIndestructibles,
            this.overlapPelotaLadrilloIndestructible, function (pelota, ladrillo) {
                return this.comprobarOverlapBolaRoja(pelota, ladrillo);
            }, this);

        // Colision pelota - ladrillos regenerativos
        this.physics.add.overlap(this.listaPelotas, this.listaLadrillosRegenerativos,
            this.overlapPelotaLadrilloRegenerativo,
            function (pelota, ladrillo) {
                ladrillo.golpes--;
                if (ladrillo.golpes <= 0 || this.comprobarOverlapBolaRoja(pelota, ladrillo)) {
                    return true;
                }
                return false;
            }, this);
        this.physics.add.collider(this.listaPelotas, this.listaLadrillosRegenerativos,
            this.colisionPelotaLadrilloRegenerativo,
            function (pelota, ladrillo) {
                if (ladrillo.golpes > 0 || this.comprobarBolaRoja(pelota, ladrillo)) {
                    return true;
                }
                return false;
            }, this);

        
        // Colision pelota - ladrillos duros
        this.physics.add.collider(this.listaPelotas, this.listaLadrillosDuros,
            this.colisionPelotaLadrilloDuro, function (pelota, ladrillo) {
                return this.comprobarBolaRoja(pelota, ladrillo);
            }, this);
        this.physics.add.overlap(this.listaPelotas, this.listaLadrillosDuros,
            this.overlapPelotaLadrilloDuro, function (pelota, ladrillo) {
                return this.comprobarOverlapBolaRoja(pelota, ladrillo);
            }, this);

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
        // Colision misil - ladrillos
        this.physics.add.collider(this.listaMisiles, this.listaLadrillos,
            this.colisionMisilLadrillo, null, this);
        // Colision misil - ladrillos indestructibles
        this.physics.add.collider(this.listaMisiles, this.listaLadrillosIndestructibles,
            this.colisionMisilLadrilloIndestructible, null, this);
        // Colision misil - ladrillos regenerativos
        this.physics.add.collider(this.listaMisiles, this.listaLadrillosRegenerativos,
            this.colisionMisilLadrilloRegenerativo,
            function (misil, ladrillo) {
                ladrillo.golpes -= 1;
                if (ladrillo.golpes > 0) {
                    return true;
                }
                return false;
            }, this);

        this.physics.add.overlap(this.listaMisiles, this.listaLadrillosRegenerativos,
            this.overlapMisilLadrilloRegenerativo,
            function (misil, ladrillo) {
                if (ladrillo.golpes <= 0) {
                    return true;
                }
                return false;
            }, this);
        // Colision misil - ladrillos duros
        this.physics.add.collider(this.listaMisiles, this.listaLadrillosDuros,
            this.colisionMisilLadrilloDuro, null, this);

        /************
            SONIDOS
        *************/
        // Añado los sonidos....
        this.click = this.sound.add("efecto_click");
        this.inicioNivel = this.sound.add("musica_inicioNivel");
        //this.inicioNivel.play();
        this.gameOver = this.sound.add("musica_gameOver");

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

        // Actualizador del objeto jugador
        this.listaJugador.getChildren().forEach(jugador => {
            jugador.update();
        });

        // Actualizador del objeto Misil
        this.listaMisiles.getChildren().forEach(misil => {
            misil.update();
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

        /* if (this.cursorKeys.up.isDown) {
            gameConfig.vidas += 1;
            this.vidasLabel.text = `Vidas: ${gameConfig.vidas}`;
        } */
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

    overlapPelotaLadrillo(pelota, ladrillo) {
        this.hacerMoverseAlLadrillo(ladrillo);
        this.generarMejora(ladrillo);
        ladrillo.destroy();
        this.aumentarPuntos(ladrillo);
        // Sistema de cambio de nivel
        this.comprobarCambiarNivel();
    }

    colisionPelotaLadrilloIndestructible(pelota, ladrillo) {
        this.reponerVelocidadPelota(pelota);
        this.click.play();
        ladrillo.play("anim_ladrillo_indestructible");
        if (ladrillo.movement && ladrillo.body.velocity.x) {
            if (ladrillo.body.velocity.x > 0) {
                ladrillo.body.velocity.x = 60;
            } else if (ladrillo.body.velocity.x < 0) {
                ladrillo.body.velocity.x = -60;
            } else if (ladrillo.body.velocity.x == 0) {
                ladrillo.body.velocity.x = 60;
            }
        }
    }

    overlapPelotaLadrilloIndestructible(pelota, ladrillo) {
        this.hacerMoverseAlLadrillo(ladrillo);
        this.aumentarPuntos(ladrillo);
        this.generarMejora(ladrillo);
        ladrillo.destroy();
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
        } else if (ladrillo.golpes <= 0) {
            this.aumentarPuntos(ladrillo);
            this.hacerMoverseAlLadrillo(ladrillo);
            this.generarMejora(ladrillo);
            ladrillo.destroy();
        }
        this.comprobarCambiarNivel();
    }

    overlapPelotaLadrilloDuro(pelota, ladrillo) {
        this.aumentarPuntos(ladrillo);
        this.hacerMoverseAlLadrillo(ladrillo);
        this.generarMejora(ladrillo);
        ladrillo.destroy();
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
        if (pelota.estaPegada) {
            pelota.body.velocity.set(
                Phaser.Math.Between(gameConfig.velocidadJugadorX * -1, gameConfig.velocidadJugadorX),
                gameConfig.velocidadPelotaY);
            pelota.estaPegada = false;
        }
        this.reponerVelocidadPelota(pelota);
    }

    colisionPelotaJugador(pelota, jugador) {
        if (pelota.texture.key !== "bola_pegajosa") {
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
        } else if (pelota.texture.key === "bola_pegajosa" && jugador.body.touching.up) {
            pelota.body.velocity.set(0, 0);
            pelota.estaPegada = true;
        }

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
                if (jugador.modoPegajoso) {
                    this.listaPelotas.getChildren().forEach(pelota => {
                        if (pelota.estaPegada) {
                            pelota.body.velocity.x = gameConfig.velocidadJugadorX * -1;
                        }
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
                if (jugador.modoPegajoso) {
                    this.listaPelotas.getChildren().forEach(pelota => {
                        if (pelota.estaPegada) {
                            pelota.body.velocity.x = gameConfig.velocidadJugadorX;
                        }
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
                if (jugador.modoPegajoso) {
                    this.listaPelotas.getChildren().forEach(pelota => {
                        if (pelota.estaPegada) {
                            pelota.body.velocity.x = 0;
                        }
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
        console.log(this.scene)
        this.scene.pause();
        this.gameOver.play();
        this.add.image(config.width / 2, config.height / 2, "game_over").setScale(0.8);
        setTimeout(function() {
            console.log(this.scene)
            this.scene.restart();
            //this.scene.remove('playGame');
        }, 2000);
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

    /**
     * Funcion que aumenta los puntos (scoreLabel) en funcion de los puntos que ofrezca el ladrillo
     * @param {*} ladrillo 
     */
    aumentarPuntos(ladrillo) {
        gameConfig.puntos += ladrillo.puntos;
        let scoreFormated = this.zeroPad(gameConfig.puntos, 7);
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
            let numeroRandom = Math.floor(Math.random() * 7);
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
                    // Mejora fucsia - vida +
                    mejora = "mejora_fucsia";
                    break;
                default:
                    // Si no se llegase a generar un numero adecuado, se genera la mejora roja por defecto
                    mejora = "mejora_roja";
                    /* console.log("ha pasado por el default en la seleccion", numeroRandom); */
                    break;
            }
            this.listaMejoras.add(new Mejora(this, xMejora, yMejora, mejora)
                .setOrigin(0.5, 0).setScale(1.5));
        }
    }

    colisionMejoraJugador(mejora, jugador) {
        let player = this.listaJugador.getChildren()[0];

        if (player.mejoraActual !== mejora.texture.key) {

            if (this.listaJugador.getChildren()[1]) {
                this.listaJugador.getChildren()[1].destroy();
            }

            player.modoPistolero = false;
            player.modoMultipaleta = false;
            player.modoMaximizar = false;
            player.modoMinimizar = false;
            player.setTexture("jugador_normal");
            player.play("anim_jugador_normal");
            player.body.width = player.getBounds().width;
            player.mejoraActual = mejora.texture.key;

            switch (mejora.texture.key) {
                case "mejora_roja":
                    // Mejora roja - maximizar
                    player.setTexture("jugador_grande");
                    player.play("anim_jugador_grande");
                    player.body.width = player.getBounds().width;
                    player.modoMaximizar = true;
                    break;
                case "mejora_azul":
                    // Mejora azul - minimizar
                    player.setTexture("jugador_peque");
                    player.play("anim_jugador_peque");
                    player.body.width = player.getBounds().width;
                    player.modoMinimizar = true;
                    break;
                case "mejora_blanca":
                    // Mejora blanca - multiple
                    if (this.listaPelotas.getLength() == 1) {
                        this.mejoraBlanca();
                        player.mejoraActual = "";
                    }
                    break;
                case "mejora_naranja":
                    // Mejora naranja - bola roja
                    player.modoPegajoso = false;
                    this.listaPelotas.getChildren().forEach(pelota => {
                        pelota.setTexture("bola_roja");
                        pelota.modoBolaRoja = true;
                        if (pelota.estaPegada) {
                            pelota.body.velocity.set(
                                Phaser.Math.Between(gameConfig.velocidadJugadorX * -1, gameConfig.velocidadJugadorX),
                                gameConfig.velocidadPelotaY);
                            pelota.estaPegada = false;
                        }
                    });
                    break;
                case "mejora_verde":
                    // Mejora verde - pegajoso
                    player.modoPegajoso = true;
                    this.listaPelotas.getChildren().forEach(pelota => {
                        pelota.setTexture("bola_pegajosa");
                        pelota.modoBolaRoja = false;
                    });
                    break;
                case "mejora_negra":
                    // Mejora negra - pistolero
                    player.setTexture("jugador_transformacion_pistolero");
                    player.play("anim_jugador_transformacion_pistolero");
                    setTimeout(function () {
                        if (player.texture.key === "jugador_transformacion_pistolero") {
                            player.setTexture("jugador_pistolero");
                            player.play("anim_jugador_pistolero");
                            player.modoPistolero = true;
                        }
                    }, player.anims.duration);
                    break;
                case "mejora_fucsia":
                    // Mejora fucsia - vida +
                    if (gameConfig.vidas < 3) {
                        gameConfig.vidas++;
                        this.vidasLabel.text = `Vidas: ${gameConfig.vidas}`;
                    }
                    break;
                default:
                    // Si no se llegase a generar un numero adecuado, se genera la mejora roja por defecto
                    player.setTexture("jugador_grande");
                    player.play("anim_jugador_grande");
                    player.body.width = player.getBounds().width;
                    player.modoMaximizar = true;
                    /* console.log("Ha pasado por el default") */
                    break;
            }
        }
        mejora.destroy();
    }

    colisionMisilLadrillo(misil, ladrillo) {
        misil.destroy();
        this.hacerMoverseAlLadrillo(ladrillo);
        this.generarMejora(ladrillo);
        ladrillo.destroy();
        this.click.play();
        this.aumentarPuntos(ladrillo);
        // Sistema de cambio de nivel
        this.comprobarCambiarNivel();
    }

    colisionMisilLadrilloIndestructible(misil, ladrillo) {
        misil.destroy();
        this.click.play();
        ladrillo.play("anim_ladrillo_indestructible");
    }

    colisionMisilLadrilloRegenerativo(misil, ladrillo) {
        misil.destroy();
        this.click.play();
        if (ladrillo.golpes == 2) {
            ladrillo.setTexture("ladrillo_regenerativo_2");
        } else if (ladrillo.golpes == 1) {
            ladrillo.setTexture("ladrillo_regenerativo_3");
        }
    }

    overlapMisilLadrilloRegenerativo(misil, ladrillo) {
        misil.destroy();
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

    colisionMisilLadrilloDuro(misil, ladrillo) {
        misil.destroy();
        this.click.play();
        ladrillo.golpes -= 1;
        if (ladrillo.golpes == 2) {
            ladrillo.setTexture("ladrillo_duro_2");
        } else if (ladrillo.golpes == 1) {
            ladrillo.setTexture("ladrillo_duro_3");
        } else if (ladrillo.golpes <= 0) {
            this.aumentarPuntos(ladrillo);
            this.hacerMoverseAlLadrillo(ladrillo);
            this.generarMejora(ladrillo);
            ladrillo.destroy();
        }
        this.comprobarCambiarNivel();
    }

    /**
     * Metodo que genera 5 pelotas segun la posicion del jugador, si esta en el modo de
     * inicioPelota, la pelota empezara a moverse
     */
    mejoraBlanca() {
        let posXPelota = this.listaPelotas.getChildren()[0].body.x;
        let posYPelota = this.listaPelotas.getChildren()[0].body.y;
        for (let i = 0; i < 5; i++) {
            let pelota = new Pelota(this, posXPelota, posYPelota, "bola_blanca");
            this.listaPelotas.add(pelota);
            pelota.body.velocity.set(
                Phaser.Math.Between(gameConfig.velocidadJugadorX * -1, gameConfig.velocidadJugadorX),
                gameConfig.velocidadPelotaY);
        }
        if (gameConfig.inicioPelota) {
            this.listaPelotas.getChildren()[0].body.velocity.set(
                Phaser.Math.Between(gameConfig.velocidadJugadorX * -1, gameConfig.velocidadJugadorX),
                gameConfig.velocidadPelotaY);
            gameConfig.inicioPelota = false;
        }
    }

    /**
     * Este metodo comprueba si la bola esta en modo bola roja, retorna true cuando
     * la bola esta en otro modo, false si esta en modo bola roja
     * @param {*} pelota 
     * @param {*} ladrillo 
     */
    comprobarBolaRoja(pelota, ladrillo) {
        if (!pelota.modoBolaRoja) {
            return true;
        }
        return false;
    }

    /**
     * Este metodo comprueba si la bola esta en modo bola roja, retorna true si esta en modo bola roja
     * false en caso de que la bola no este en modo bola roja
     * @param {*} pelota 
     * @param {*} ladrillo 
     */
    comprobarOverlapBolaRoja(pelota, ladrillo) {
        if (pelota.modoBolaRoja) {
            return true;
        }
        return false;
    }

    /**
     * Metodo que comprueba si en el lado en el que golpea la pelota, hay un ladrillo pegado,
     * si lo hay devuelve true, en caso contrario devuelve false.
     * Metodo actualmente sin uso debido a que aun no se conoce como aplicarlo en el sistema de
     * colisiones de phaser
     * @param {*} ladrillo 
     */
    hayLadrilloPegado(ladrillo) {
        if (ladrillo.body.touching.up) {
            // Si toca el ladrillo por arriba
            //+32x +16y
            for (let lad of this.listaTodosLadrillos) {
                if (lad.body.x == ladrillo.body.x && lad.body.y == ladrillo.body.y - 16){
                    // encuentra ladrillo encima
                    console.log("hay ladrillo encima")
                    return true;
                }
            }
        } else if (ladrillo.body.touching.down) {
            // Si toca por abajo
            console.log("ha tocado abajo")
            for (let lad of this.listaTodosLadrillos) {
                if (lad.body.x == ladrillo.body.x && lad.body.y == ladrillo.body.y + 16){
                    // encuentra ladrillo debajo
                    console.log("hay ladrillo debajo")
                    return true;
                }
            }
        } else if (ladrillo.body.touching.right) {
            // Si toca por la derecha
            for (let lad of this.listaTodosLadrillos) {
                if (lad.body.x == ladrillo.body.x + 32 && lad.body.y == ladrillo.body.y){
                    // encuentra ladrillo a su derecha
                    return true;
                }
            }
        } else if (ladrillo.body.touching.left) {
            // Si toca por la izquierda
            for (let lad of this.listaTodosLadrillos) {
                if (lad.body.x == ladrillo.body.x - 32 && lad.body.y == ladrillo.body.y){
                    // encuentra ladrillo a su izquierda
                    return true;
                }
            }
        } else {
            return false;
        }
    }
}