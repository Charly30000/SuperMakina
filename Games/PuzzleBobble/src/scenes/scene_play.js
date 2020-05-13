class Scene_play extends Phaser.Scene {
    constructor() {
        super({ key: "Scene_play" })
    }

    create() {

        //comprueba en la variable global del init en que numero de nivel nos encontramos y coge del nivel(numero).js toda la informacion
        switch (gameConfig.numeronivel) {
            case 1:
                gameConfig.nivel = nivel1;
                break;
            case 2:
                gameConfig.nivel = nivel2;
                break;
            case 3:
                gameConfig.nivel = nivel3;
                break;
            case 4:
                gameConfig.nivel = nivel4;
                break;
            case 5:
                gameConfig.nivel = nivel5;
                break;
            case 6:
                gameConfig.nivel = nivel6;
                break;
            case 7:
                gameConfig.nivel = nivel7;
                break;
            case 8:
                gameConfig.nivel = nivel8;
                break;
            case 9:
                gameConfig.nivel = nivel9;
                break;
            case 10:
                gameConfig.nivel = nivel10;
                break;
            default:
                gameConfig.nivel = nivel1;
                break;
        }


        document.getElementById("nivel").textContent = "Nivel: " + gameConfig.numeronivel;


        // se carga el fondo, borde, flecha y dragones
        this.add.image(450, 300, gameConfig.nivel.fondo).setScale(3);
        this.add.image(this.sys.game.config.width / 2, 300, gameConfig.nivel.borde).setScale(3);
        this.lineaGameOver = this.physics.add.image(this.sys.game.config.width / 2, 505, "lineago").setScale(3);
        this.add.image(this.sys.game.config.width / 2.07, 565, 'maquinaria').setScale(3);
        this.add.image(this.sys.game.config.width / 2, 510, 'rueda').setScale(3);
        this.flecha = this.add.image(this.sys.game.config.width / 2, 525, 'flecha').setScale(3);
        this.add.image(this.sys.game.config.width / 2.8, 565, 'saco').setScale(3);
        this.dragonesiz = this.physics.add.sprite(this.sys.game.config.width / 2.13, 575, 'dragones1').setScale(3);
        this.dragonesderec = this.physics.add.sprite(this.sys.game.config.width / 1.65, 575, 'dragones2').setScale(3);



        // crea el array de todas las filas del nivel para guardar las referencias de las burbujas
        gameConfig.arrayburbujas = new Array(this.crearfila(8), this.crearfila(7), this.crearfila(8), this.crearfila(7), this.crearfila(8), this.crearfila(7),
            this.crearfila(8), this.crearfila(7), this.crearfila(8), this.crearfila(7), this.crearfila(8), this.crearfila(7));


        // se crean las bolas del nivel, guardandolas en un grupo de phaser y guardando una referencia es su lugar del
        // mapa en el array
        let x = 0;
        let y = 0;
        let fila = -1;
        let columna = 0;
        this.burbujasNivel = this.add.group();
        gameConfig.nivel.burbuja.forEach(arrayElementos => {
            fila++;
            columna = 0;
            y = this.sys.game.config.height / 10 + fila * 45;
            arrayElementos.forEach(elemento => {
                // la fila es de 8
                if (fila % 2 == 0) {
                    if (columna == 0) {
                        x = this.sys.game.config.width / 3.2;
                    } else {
                        x = x + 48;
                    }
                    if (elemento != " ") {
                        gameConfig.arrayburbujas[fila][columna] = fila + "-" + columna + "-" + elemento.color;
                        this.burbujasNivel.add(new Burbuja(this, x, y, elemento.burbuja, elemento.color, fila + "-" + columna + "-" + elemento.color).setScale(3));
                    }
                    //la fila es de 7
                } else {
                    if (columna == 0) {
                        x = this.sys.game.config.width / 2.95
                    } else {
                        x = x + 48;
                    }
                    if (elemento != " ") {
                        gameConfig.arrayburbujas[fila][columna] = fila + "-" + columna + "-" + elemento.color;
                        this.burbujasNivel.add(new Burbuja(this, x, y, elemento.burbuja, elemento.color, fila + "-" + columna + "-" + elemento.color).setScale(3));
                    }
                }
                columna++;
            });
        });



        // se crean las dos bolas de lanzar
        this.lanzarbola = this.crearbolalanzar(this.sys.game.config.width / 2, 525);
        this.lanzarbolasegunda = this.crearbolalanzar(this.sys.game.config.width / 2.5, 600);

        //se crean los cursores
        this.cursor_space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        gameConfig.cursores = this.input.keyboard.createCursorKeys();


        // colision entre burbuja movil y el grupo de burbujas
        this.physics.add.collider(this.lanzarbola, this.burbujasNivel, this.colisionPelotas, null, this);



    }


    update() {
        //comprueba si eliminaste todas las bolas
        if (this.burbujasNivel.getLength() == 0) {
            gameConfig.crearbola = false;
            this.pasarnivel();
        }

        //por cada milisegundo quita uno de la puntuacion maxima que puede ganar
        gameConfig.puntuacionvelocidad--;



        if (this.cursor_space.isDown) {
            this.dragonesiz.anims.play('dragones1', true);
            this.dragonesderec.anims.play('dragones2', true);
            if (this.lanzarbola.body.velocity.x == 0 && this.lanzarbola.body.velocity.y == 0) {
                this.lanzarbola.body.velocity.set(gameConfig.velocidadburbujax, gameConfig.velocidadburbujay);
                gameConfig.movimientox = -this.lanzarbola.body.velocity.x;
            }
        }


        // para cambiar la velocidad si choca con el lado izquierdo
        if (this.lanzarbola.x < this.sys.game.config.width / 3.2) {
            if (gameConfig.bolachocaderecha) {
                gameConfig.movimientox = -gameConfig.movimientox;
            }
            this.lanzarbola.body.velocity.set(gameConfig.movimientox, this.lanzarbola.body.velocity.y);
            gameConfig.bolachocaizquierda = true;
            gameConfig.bolachocaderecha = false;
            // para cambiar la velocidad si choca con el lado derecho
        } else if (this.lanzarbola.x > this.sys.game.config.width / 3.2 + 335) {
            if (gameConfig.bolachocaizquierda) {
                gameConfig.movimientox = -gameConfig.movimientox;
            }
            this.lanzarbola.body.velocity.set(gameConfig.movimientox, this.lanzarbola.body.velocity.y);
            gameConfig.bolachocaizquierda = false;
            gameConfig.bolachocaderecha = true;
        }



        //pega la burbuja al techo
        if (this.sys.game.config.height / 10 + gameConfig.altura > this.lanzarbola.y) {
            let x1 = 0;
            let x2 = 0;
            let color = this.lanzarbola.name;
            let iterador = 0;
            let encontrado = false;
            while (!encontrado || iterador > 8) {
                x1 = (this.sys.game.config.width / 3.2 - 24) + iterador * 48;
                x2 = (this.sys.game.config.width / 3.2 - 24) + (iterador + 1) * 48;
                if (this.lanzarbola.x >= x1 && this.lanzarbola.x <= x2) {
                    gameConfig.arrayburbujas[0][iterador] = 0 + "-" + iterador + "-" + color;
                    this.burbujasNivel.add(new Burbuja(this, this.sys.game.config.width / 3.2 + 48 * iterador, this.sys.game.config.height / 10 + gameConfig.altura,
                        "burbuja" + color, color, 0 + "-" + iterador + "-" + color).setScale(3));
                    this.lanzarbola.destroy();
                    let choquebolas = this.detectarsiexplosion(0 + "-" + iterador + "-" + color);
                    if (choquebolas.length >= 3) {
                        this.eliminarbolas(choquebolas);
                        let aisladas = this.detectarBurbujasAisladas();
                        if (aisladas.length > 0) {
                            this.eliminarbolas(aisladas);
                        }
                    }
                    this.modificarbolasmoviles();
                    encontrado = true;

                } else {
                    iterador++;
                }
            }
        }

        /* gira la flecha hacia la izquierda y la derecha, y guarda la velocidad con la que va a salir la bola
        en cada eje */
        if (gameConfig.cursores.left.isDown) {
            if (gameConfig.velocidadburbujax > -800 && gameConfig.velocidadburbujay < 0) {
                if (gameConfig.velocidadburbujax < 0) {
                    gameConfig.velocidadburbujay += 10;
                } else {
                    gameConfig.velocidadburbujay -= 10;
                }
                gameConfig.velocidadburbujax -= 10;
                this.flecha.angle = Math.round(this.flecha.angle - 1.00);
            }

        } else if (gameConfig.cursores.right.isDown) {
            if (gameConfig.velocidadburbujax < 800 && gameConfig.velocidadburbujay < 0) {
                if (gameConfig.velocidadburbujax > 0) {
                    gameConfig.velocidadburbujay += 10;
                } else {
                    gameConfig.velocidadburbujay -= 10;
                }
                gameConfig.velocidadburbujax += 10;
                this.flecha.angle = Math.round(this.flecha.angle + 1.00);
            }
        }


        //baja el techo cada 8 bolas
        if (gameConfig.contador >= 8) {
            if (gameConfig.crearbola) {
                gameConfig.altura += 45;
                this.moverburbujas();
                gameConfig.contador = 0;
            }
        }
    }

    // se encarga de mover todas la burbujas hacia abajo y de crear los techos
    moverburbujas() {
        this.burbujasNivel.getChildren().forEach(burbuja => {
            burbuja.y = burbuja.y + 45;
        });
        if (gameConfig.altura == 45) {
            this.add.image(this.sys.game.config.width / 2 - 1, 46, gameConfig.nivel.techoAdicional).setScale(3);
            this.techo = this.add.image(this.sys.game.config.width / 2 - 1, 68, gameConfig.nivel.techoInferior).setScale(3);
        } else {
            this.add.image(this.sys.game.config.width / 2 - 1, this.techo.y, gameConfig.nivel.techoAdicional).setScale(3);
            this.add.image(this.sys.game.config.width / 2 - 1, this.techo.y + 23, gameConfig.nivel.techoAdicional).setScale(3);
            this.techo = this.techo = this.add.image(this.sys.game.config.width / 2 - 1, this.techo.y + 45, gameConfig.nivel.techoInferior).setScale(3);
        }
    }


    // crea un array con 7 o 8 sitios
    crearfila(numero) {
        if (numero == 7) {
            return [" ", " ", " ", " ", " ", " ", " "];
        } else if (numero == 8) {
            return [" ", " ", " ", " ", " ", " ", " ", " "];
        }
    }

    //comprueba si la colision ha sido por abajo, izquierda o derecha 
    colisionPelotas(burbujamovil, burbuja) {
        if (gameConfig.crearbola) {
            gameConfig.contador++;
            let color = burbujamovil.name;
            let coordenadas = burbuja.posicion.split("-");
            coordenadas[0] = parseInt(coordenadas[0]);
            coordenadas[1] = parseInt(coordenadas[1]);
            if (burbuja.y + 23 <= burbujamovil.y) {
                burbujamovil.destroy();
                if (gameConfig.arrayburbujas[coordenadas[0]].length == coordenadas[1] + 1 && coordenadas[0] % 2 == 0) {
                    coordenadas[1] = coordenadas[1] - 1;
                } else if (burbujamovil.x < burbuja.x && coordenadas[0] % 2 == 0 && gameConfig.arrayburbujas[coordenadas[0] + 1][coordenadas[1] - 1] == " ") {
                    coordenadas[1] = coordenadas[1] - 1;
                }

                if (burbujamovil.x > burbuja.x && coordenadas[0] % 2 != 0 && gameConfig.arrayburbujas[coordenadas[0] + 1][coordenadas[1] + 1] == " ") {
                    coordenadas[1] = coordenadas[1] + 1;
                }

                coordenadas[0] = coordenadas[0] + 1;
                this.posicionarpelota(coordenadas, color);


            } else if (burbujamovil.x < burbuja.x) {
                burbujamovil.destroy();
                coordenadas[1] = coordenadas[1] - 1;
                this.posicionarpelota(coordenadas, color);

            } else {
                burbujamovil.destroy();
                coordenadas[1] = coordenadas[1] + 1;
                this.posicionarpelota(coordenadas, color);
            }
        }
    }

    /*,Guarda la burbuja en el grupo y la añade al array, comprobando si las burbujas explotan o quedan alguna bola sin estar 
    tocando a otras */
    posicionarpelota(coordenadas, color) {
        let xocho = this.sys.game.config.width / 3.2;
        let xsiete = this.sys.game.config.width / 2.95;
        let y = this.sys.game.config.height / 10 + gameConfig.altura;
        if (coordenadas[0] % 2 == 0) {
            this.burbujasNivel.add(new Burbuja(this, xocho + coordenadas[1] * 48, y + coordenadas[0] * 45, "burbuja" + color, color, coordenadas[0] + "-" + coordenadas[1] + "-" + color).setScale(3));
        } else {
            this.burbujasNivel.add(new Burbuja(this, xsiete + coordenadas[1] * 48, y + coordenadas[0] * 45, "burbuja" + color, color, coordenadas[0] + "-" + coordenadas[1] + "-" + color).setScale(3));
        }
        gameConfig.arrayburbujas[coordenadas[0]][coordenadas[1]] = coordenadas[0] + "-" + coordenadas[1] + "-" + color;
        let choquebolas = this.detectarsiexplosion(coordenadas[0] + "-" + coordenadas[1] + "-" + color);
        if (choquebolas.length >= 3) {
            this.eliminarbolas(choquebolas);
            let aisladas = this.detectarBurbujasAisladas();
            if (aisladas.length > 0) {
                this.eliminarbolas(aisladas);
            }
        }
        this.physics.add.collider(this.lineaGameOver, this.burbujasNivel, this.gameover, null, this);
        this.modificarbolasmoviles();
    }


    /* mueve la segunda bola a la primera posicion de lanzar y crea una nueva bola para el segundo sitio
     */
    modificarbolasmoviles() {
        this.lanzarbola = this.lanzarbolasegunda;
        this.lanzarbola.x = this.sys.game.config.width / 2,
            this.lanzarbola.y = 525;
        this.lanzarbolasegunda = this.crearbolalanzar(this.sys.game.config.width / 2.5, 600);
        this.physics.add.collider(this.lanzarbola, this.burbujasNivel, this.colisionPelotas, null, this);
        gameConfig.bolachocaizquierda = false;
        gameConfig.bolachocaderecha = false;
    }




    // crea una nueva bola con el color que le pasa colorbolanueva
    crearbolalanzar(x, y) {
        let colorlanzar = this.colorbolanueva();
        return new Burbuja(this, x, y, "burbuja" + colorlanzar, colorlanzar, " ").setScale(3);
    }

    // mira el bloque de burbujas y devuelve un array con los colores que tiene el bloque
    colorbolanueva() {
        let arrayburbujaslanzar = new Array();
        this.burbujasNivel.children.entries.forEach(arrayElementos => {
            if (!arrayburbujaslanzar.includes(arrayElementos.name)) {
                arrayburbujaslanzar.push(arrayElementos.name);
            }
        });
        let posicion = Math.floor(Math.random() * (arrayburbujaslanzar.length - 0)) + 0;
        return arrayburbujaslanzar[posicion];
    }


    //elimina las burbujas del array que le pasan
    eliminarbolas(array) {
        let contador = 0;
        while (array.length != 0) {
            let burbujaarray = array.pop();
            this.burbujasNivel.getChildren().forEach(burbuja => {
                if (burbuja.posicion == burbujaarray) {
                    burbuja.destroy();
                    contador++;
                }
            });
            for (let i = 0; i < gameConfig.arrayburbujas.length; i++) {
                for (let j = 0; j < gameConfig.arrayburbujas[i].length; j++) {
                    if (gameConfig.arrayburbujas[i][j] == burbujaarray) {
                        gameConfig.arrayburbujas[i][j] = " ";
                    }
                }

            }
        }
        this.aumentarPuntos(contador);
    }




    //comprueba si hay cuatro burbujas juntas del mismo color apartir de la burbuja que acabamos de lanzar
    detectarsiexplosion(posicion) {
        let arrayBurbujasAisladas = [];
        let setBurbujasVisitadas = new Set();
        let burbujasAVisitar = []; // lo que usaremos a modo de pila
        let burbujapasada = posicion.split("-");
        let colorBurbuja = burbujapasada[2];
        burbujasAVisitar.push(posicion);
        setBurbujasVisitadas.add(posicion);
        arrayBurbujasAisladas.push(posicion);
        let burbuja;
        let adyacentes;

        while (burbujasAVisitar.length != 0) {
            burbuja = burbujasAVisitar.pop();
            adyacentes = this.burbujasAdyacentes(burbuja);
            adyacentes.forEach(adyacente => {
                let coordenadas = adyacente.split("-");
                if (!setBurbujasVisitadas.has(adyacente)) {
                    if (colorBurbuja == coordenadas[2]) {
                        burbujasAVisitar.push(adyacente);
                        setBurbujasVisitadas.add(adyacente);
                        arrayBurbujasAisladas.push(adyacente);
                    }
                }
            });
        }
        return arrayBurbujasAisladas;
    }





    // comprueba si hay alguna burbuja que no este unida a las demas
    detectarBurbujasAisladas() {
        let arrayBurbujasAisladas = [];
        let setBurbujasVisitadas = new Set();
        let burbujasAVisitar = []; // lo que usaremos a modo de pila
        for (let i = 0; i < gameConfig.arrayburbujas[0].length; i++) {
            if (gameConfig.arrayburbujas[0][i] != " ") {
                burbujasAVisitar.push(gameConfig.arrayburbujas[0][i]);
                setBurbujasVisitadas.add(gameConfig.arrayburbujas[0][i]);
            }
        }
        let burbuja;
        let adyacentes;
        while (burbujasAVisitar.length != 0) {
            burbuja = burbujasAVisitar.pop();
            adyacentes = this.burbujasAdyacentes(burbuja);
            adyacentes.forEach(adyacente => {
                if (!setBurbujasVisitadas.has(adyacente)) {
                    burbujasAVisitar.push(adyacente);
                    setBurbujasVisitadas.add(adyacente);
                }
            });
        }

        gameConfig.arrayburbujas.forEach(fila => {
            fila.forEach(burbuja => {
                if (burbuja != " ") {
                    if (!setBurbujasVisitadas.has(burbuja)) {
                        arrayBurbujasAisladas.push(burbuja);
                    }
                }
            });
        });
        return arrayBurbujasAisladas;
    }



    /*comprueba si las burbujas Adyacentes son del mismo color y si lo son luego lo comprueba con ella
    asi hasta que no encuentre ninguna Adyacente del mismo color */
    burbujasAdyacentes(posicion) {
        let coordenadas = posicion.split("-");
        let fila = parseInt(coordenadas[0]);
        let columna = parseInt(coordenadas[1]);
        let arrayAdyacentes = [];
        // fila de 8
        if (fila % 2 == 0) {
            // burbujas superiores
            if (fila - 1 >= 0) {
                if ((columna - 1 >= 0) && (gameConfig.arrayburbujas[fila - 1][columna - 1] != " ")) {
                    arrayAdyacentes.push(gameConfig.arrayburbujas[fila - 1][columna - 1]);
                }
                if ((columna <= gameConfig.arrayburbujas[fila - 1].length - 1) && (gameConfig.arrayburbujas[fila - 1][columna] != " ")) {
                    arrayAdyacentes.push(gameConfig.arrayburbujas[fila - 1][columna]);
                }
            }
            // burbujas inferiores
            if (fila + 1 <= gameConfig.arrayburbujas.length) {
                if ((columna - 1 >= 0) && (gameConfig.arrayburbujas[fila + 1][columna - 1] != " ")) {
                    arrayAdyacentes.push(gameConfig.arrayburbujas[fila + 1][columna - 1]);
                }
                if ((columna <= gameConfig.arrayburbujas[fila + 1].length - 1) && (gameConfig.arrayburbujas[fila + 1][columna] != " ")) {
                    arrayAdyacentes.push(gameConfig.arrayburbujas[fila + 1][columna]);
                }
            }
            // fila de 7
        } else {
            // burbujas superiores
            if (gameConfig.arrayburbujas[fila - 1][columna] != " ") {
                arrayAdyacentes.push(gameConfig.arrayburbujas[fila - 1][columna]);
            }
            if (gameConfig.arrayburbujas[fila - 1][columna + 1] != " ") {
                arrayAdyacentes.push(gameConfig.arrayburbujas[fila - 1][columna + 1]);
            }
            // burbujas inferiores
            if (fila + 1 <= gameConfig.arrayburbujas.length) {
                if (gameConfig.arrayburbujas[fila + 1][columna] != " ") {
                    arrayAdyacentes.push(gameConfig.arrayburbujas[fila + 1][columna]);
                }
                if (gameConfig.arrayburbujas[fila + 1][columna + 1] != " ") {
                    arrayAdyacentes.push(gameConfig.arrayburbujas[fila + 1][columna + 1]);
                }
            }
        }
        // burbujas laterales
        if ((columna - 1 >= 0) && (gameConfig.arrayburbujas[fila][columna - 1] != " ")) {
            arrayAdyacentes.push(gameConfig.arrayburbujas[fila][columna - 1]);
        }
        if ((columna < gameConfig.arrayburbujas[fila].length - 1) && (gameConfig.arrayburbujas[fila][columna + 1] != " ")) {
            arrayAdyacentes.push(gameConfig.arrayburbujas[fila][columna + 1]);
        }
        return arrayAdyacentes;
    }


    aumentarPuntos(numero) {
        gameConfig.puntos += numero * 50;
        document.getElementById("puntuacion").textContent = "SCORE: " + gameConfig.puntos;
    }

    // añadir cuando se terminen los niveles
    pasarnivel() {
        gameConfig.numeronivel++;
        if (gameConfig.numeronivel == 10) {
            this.ganarjuego();
        } else {
            gameConfig.altura = 0;
            this.flecha.angle = 0;
            gameConfig.velocidadburbujax = 0,
                gameConfig.velocidadburbujay = -900;
            gameConfig.contador = 0;
            gameConfig.crearbola = true;
            gameConfig.puntos += gameConfig.puntuacionvelocidad;
            document.getElementById("puntuacion").textContent = "SCORE: " + gameConfig.puntos;
            gameConfig.puntuacionvelocidad = 20000;
            this.scene.restart();
        }
    }
    reiniciartodo() {
        gameConfig.altura = 0;
        this.flecha.angle = 0;
        gameConfig.velocidadburbujax = 0,
            gameConfig.velocidadburbujay = -900;
        gameConfig.contador = 0;
        gameConfig.crearbola = true;
        //gameConfig.puntos = 0;
        gameConfig.puntuacionvelocidad = 20000;
        gameConfig.numeronivel = 1;
    }

    gameover(linea, burbuja) {
        if (burbuja.body.transform.y > 505) {
            gameConfig.crearbola = false;
            this.reiniciartodo();
            var escena = this.scene;
            escena.pause();
            this.add.image(this.sys.game.config.width / 2, 300, "gameover").setScale(3);
            setTimeout(function () {
                escena.start("GameOver");
                escena.stop();
            }, 2000);
        }
    }
    ganarjuego() {
        gameConfig.crearbola = false;
        this.reiniciartodo();
        var escena = this.scene;
        escena.pause();
        console.log("gane");
        //this.add.image(this.sys.game.config.width / 2, 300, "victoria").setScale(3);
        setTimeout(function () {
            escena.start("GameOver");
            escena.stop();
        }, 2000);

    }
}