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
        this.listaTodosLadrillos = [];
        let contador = 0;
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
                    this.listaTodosLadrillos.push(ladrillo.body.name = `l-${contador}`);
                    contador += 1;
                }
                posX += 32;
            });
            posX = 40;
            posY += 16;
        });
        
        // Hacer mover a los ladrillos desde el inicio si estos no tienen ladrillos a los lados
        this.listaLadrillos.getChildren().forEach(element => {
            //console.log(element.body.name)
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
        this.physics.add.collider(this.listaLadrillos, this.listaLadrillos, this.colisionLadrilloLadrillo, null, this);
        // Colision ladrillo - ladrillo duro
        this.physics.add.collider(this.listaLadrillos, this.listaLadrillosDuros, this.colisionLadrilloLadrillo, null, this);
        // Colision ladrillo - ladrillo indestructible
        this.physics.add.collider(this.listaLadrillos, this.listaLadrillosIndestructibles, this.colisionLadrilloLadrillo, null, this);
        // Colision ladrillo - ladrillo regenerativo
        this.physics.add.collider(this.listaLadrillos, this.listaLadrillosRegenerativos, this.colisionLadrilloLadrillo, null, this);
        // Colision ladrillo - barras
        this.physics.add.collider(this.listaLadrillos, this.listaBarras, this.colisionLadrilloBarra, null, this);
        // Colision ladrillo duro - barra
        this.physics.add.collider(this.listaLadrillosDuros, this.listaBarras, this.colisionLadrilloBarra, null, this);
        // Colision ladrillo indestructible - barra
        this.physics.add.collider(this.listaLadrillosIndestructibles, this.listaBarras, this.colisionLadrilloBarra, null, this);
        // Colision ladrillo regenerativo - barra
        this.physics.add.collider(this.listaLadrillosRegenerativos, this.listaBarras, this.colisionLadrilloBarra, null, this);
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
        
    }

    update() {
        // Actualizador de los objetos Pelota
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

    }

    colisionPelotaLadrillo(pelota, ladrillo) {
        this.reponerVelocidadPelota(pelota);
        this.hacerMoverseAlLadrillo(ladrillo);
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
        this.listaLadrillosRegenerativos.add(
            new LadrilloRegenerativo(this, posX, posY, "ladrillo_regenerativo", movement)
                .setOrigin(0, 0).play("anim_ladrillo_regenerativo"));
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

        /* console.log(ladrillo.body.name);
        console.log(this.listaTodosLadrillos.indexOf(ladrillo.body.name));
        this.listaTodosLadrillos.splice(this.listaTodosLadrillos.indexOf(ladrillo.body.name), 1);
        console.log(this.listaTodosLadrillos.indexOf(ladrillo.body.name)); */

        let nameLadIzda = `l-${this.listaTodosLadrillos.indexOf(ladrillo.body.name) - 1}`;
        let nameLadDcha = `l-${this.listaTodosLadrillos.indexOf(ladrillo.body.name) + 1}`;
        console.log(nameLadIzda);
        
        // busco el ladrillo de la izquierda
        let ladIzda = this.obtenerLadrillo(nameLadIzda);
        // busco el ladrillo de la derecha
        let ladDcha = this.obtenerLadrillo(nameLadDcha);

        if (!(ladrillo.body.name === "ladrillo_indestructible" || ladrillo.body.name === "ladrillo_regenerativo")){
            this.listaTodosLadrillos.splice(this.listaTodosLadrillos.indexOf(ladrillo.body.name), 1)
        }
        
        console.log("--------------------------------------------------");

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

    /**
     * El metodo busca en todos los arrays de ladrillos el ladrillo buscado, si lo encuentra, lo devuelve,
     * si no lo encuentra, devuelve un null
     * @param {*} nombreLadrillo nombre del ladrillo buscado
     */
    obtenerLadrillo(nombreLadrillo) {
        var retorno = null;
        for (const ladrillo of this.listaLadrillos.getChildren()) {
            if (nombreLadrillo === ladrillo.body.name) {
                retorno = ladrillo;
                break;
            }
        }
        if (retorno) {
            return retorno;
        }
        for (const ladrillo of this.listaLadrillosDuros.getChildren()) {
            if (nombreLadrillo === ladrillo.body.name) {
                retorno = ladrillo;
                break;
            }
        }
        if (retorno) {
            return retorno;
        }
        for (const ladrillo of this.listaLadrillosIndestructibles.getChildren()) {
            if (nombreLadrillo === ladrillo.body.name) {
                retorno = ladrillo;
                break;
            }
        }
        if (retorno) {
            return retorno;
        }
        for (const ladrillo of this.listaLadrillosRegenerativos.getChildren()) {
            if (nombreLadrillo === ladrillo.body.name) {
                retorno = ladrillo;
                break;
            }
        }
        return retorno;
    }

    colisionLadrilloLadrillo(ladrillo1, ladrillo2) {
        if (ladrillo1.movement) {
            ladrillo1.body.velocity.x *= -1;
        }
        if (ladrillo2.movement && ladrillo2.texture.key !== ladrillo2.texture.key) {
            ladrillo2.body.velocity.x *= -1;
        }
    }

    colisionLadrilloBarra(ladrillo, barra) {
        if (ladrillo.movement) {
            ladrillo.body.velocity.x *= -1;
        }
    }
}