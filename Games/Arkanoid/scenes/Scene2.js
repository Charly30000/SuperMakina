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
        this.scoreLabel = this.add.text(16, 8, "SCORE: 000000");

        // Sistema de colocacion de ladrillos por el nivel
        var posX = 40;
        var posY = 80;
        this.listaLadrillos = this.add.group();
        cargaNivel.ladrillos.forEach(arrayLadrillos => {
            arrayLadrillos.forEach(element => {
                if (element.ladrillo) {
                    this.listaLadrillos.add(new Ladrillo(this, posX, posY, element.ladrillo, element.movement));
                }
                posX += 32;
            });
            posX = 40;
            posY += 16;
        });

        // Pelotas
        this.listaPelotas = this.add.group();
        this.listaPelotas.add(new Pelota(this, config.width / 2, config.height / 2, "bola_blanca"));

        // Jugador
        this.listaJugador = this.add.group();
        this.listaJugador.add(new Jugador(this, gameConfig.posicionJugadorX, gameConfig.posicionJugadorY, "jugador_normal"));

        /**************** 
            COLISIONES
        *****************/
        // Colision pelota - ladrillos
        this.physics.add.collider(this.listaPelotas, this.listaLadrillos, this.colisionPelotaLadrillo, null, this);
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
    }

    colisionPelotaLadrillo(pelota, ladrillo) {
        this.reponerVelocidadPelota(pelota);
        /* console.log(ladrillo.body.touching.down);
        console.log(ladrillo.body.x) */
        // Comprobar que no tenga ladrillos en el orden: abajo-izquierda-derecha-arriba
        ladrillo.destroy();
        this.click.play();
        gameConfig.puntos += ladrillo.puntos;
        let scoreFormated = this.zeroPad(gameConfig.puntos, 6);
        this.scoreLabel.text = `SCORE: ${scoreFormated}`;
    }

    /**
     * Este metodo unicamente repone la velocidad de la pelota en caso de que su velocidad en Y cambie.
     * Este metodo ha sido creado debido a que cuando la pelota choca con varios objetos simultaneamente,
     * esta, por el funcionamiento de Phaser, hace que se reduzca su velocidad.
     * La velocidad en X si se modifica, pero no es cambiada ya que no parece afectar al funcionamiento normal del
     * juego, unicamente le da un efecto más realista
     * @param {*} pelota Pasar el objeto de la pelota para reponerle la velocidad original marcada
     */
    reponerVelocidadPelota(pelota) {
        if (pelota.body.velocity.y > 0) {
            pelota.body.velocity.y = gameConfig.velocidadPelotaY * -1;
        } else if (pelota.body.velocity.y <= 0) {
            pelota.body.velocity.y = gameConfig.velocidadPelotaY;
        }
        if (pelota.body.velocity.x > gameConfig.velocidadJugadorX) {
            pelota.body.velocity.x = gameConfig.velocidadJugadorX;
        }
    }

    colisionPelotaBarras(pelota, barra) {
        this.reponerVelocidadPelota(pelota);
    }

    colisionPelotaJugador(pelota, jugador) {
        this.reponerVelocidadPelota(pelota);
    }

    movimientoJugador() {
        this.listaJugador.getChildren().forEach(jugador => {
            if (this.cursorKeys.left.isDown && jugador.body.x > (this.barraLateralIzda.body.x + this.barraLateralIzda.body.width)) {
                jugador.body.setVelocityX(gameConfig.velocidadJugadorX * -1);
            } else if (this.cursorKeys.right.isDown && (jugador.body.x + jugador.body.width) < this.barraLateralDcha.x) {
                jugador.body.setVelocityX(gameConfig.velocidadJugadorX);
            } else {
                jugador.body.setVelocityX(0);
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

}