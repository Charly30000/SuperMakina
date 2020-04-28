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
                gameConfig.numeronivel = 1;
                break;
        }



        // se carga el fondo y el borde segun el nivel en el que estas
        this.add.image(450, 300, gameConfig.nivel.fondo).setScale(3);
        this.add.image(this.sys.game.config.width / 2, 300, gameConfig.nivel.borde).setScale(3);
        this.lineaGameOver = this.physics.add.image(this.sys.game.config.width / 2, 505, "lineago").setScale(3);
        this.physics.add.sprite(this.sys.game.config.width / 2.1,  550, 'maquinaria').setScale(3);
        this.scoreLabel = this.add.text(10, 100, `SCORE: ${this.zeroPad(gameConfig.puntos, 6)}`,{ fontSize: '32px', fill: 'yellow'});
        this.nivelLabel = this.add.text(10, 130, `Nivel: ${gameConfig.numeronivel}`,{ fontSize: '32px', fill: 'yellow'});

        //se crea la flecha
        this.flecha = this.add.image(this.sys.game.config.width / 2, 525, 'flecha').setScale(3);


        // crea el array de todas las filas del nivel para guardar las referencias de las burbujas
        gameConfig.arrayburbujas = new Array(this.crearfila(8), this.crearfila(7), this.crearfila(8), this.crearfila(7), this.crearfila(8), this.crearfila(7),
            this.crearfila(8), this.crearfila(7), this.crearfila(8), this.crearfila(7), this.crearfila(8),this.crearfila(7));


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
        this.lanzarbolasegunda = this.crearbolalanzar(this.sys.game.config.width / 2.4, 600);


        this.cursor_space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        gameConfig.cursores = this.input.keyboard.createCursorKeys();


        // colision entre burbuja movil y el grupo de burbujas
        this.physics.add.collider(this.lanzarbola, this.burbujasNivel, this.colisionPelotas, null, this);

        

    }
    zeroPad(number, size) {
        let stringNumber = String(number);
        while (stringNumber.length < (size || 2)) {
            stringNumber = "0" + stringNumber;
        }
        return stringNumber;
    }

    // crea un array con 7 o 8 sitios
    crearfila(numero) {
        if (numero == 7) {
            return [" ", " ", " ", " ", " ", " ", " "];
        } else if (numero == 8) {
            return [" ", " ", " ", " ", " ", " ", " ", " "];
        }
    }

    colisionPelotas(burbujamovil, burbuja) {
        gameConfig.contador++;
        let color = burbujamovil.name;
        let coordenadas = burbuja.posicion.split("-");
        coordenadas[0] = parseInt(coordenadas[0]);
        coordenadas[1] = parseInt(coordenadas[1]);
        //burbujamovil.body.touching.left
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
            if(this.burbujasNivel.getLength() == 0) {
                gameConfig.crearbola = false;
                this.ganarnivel();
            }
        }
        this.physics.add.collider(this.lineaGameOver, this.burbujasNivel, this.gameover, null, this);
            this.modificarbolasmoviles();
    }

    // añadir cuando se terminen los niveles
    ganarnivel() {
            gameConfig.numeronivel++;
            gameConfig.altura = 0;
            this.flecha.angle = 0;
            gameConfig.velocidadburbujax = 0,
            gameConfig.velocidadburbujay = -900;
            gameConfig.contador = 0;
            gameConfig.crearbola = true;
            this.scene.restart();
    }
    aumentarPuntos(numero) {
        gameConfig.puntos += numero * 10;
        let scoreFormated = this.zeroPad(gameConfig.puntos, 6);
        this.scoreLabel.text = `SCORE: ${scoreFormated}`;
    }
    gameover() {
        this.scene.pause();
        //gameConfig.crearbola = false;
        console.log("muerto");
    }

    modificarbolasmoviles() {
        if(gameConfig.crearbola) {
        this.lanzarbola = this.lanzarbolasegunda;
        this.lanzarbola.x = this.sys.game.config.width / 2,
            this.lanzarbola.y = 525;
        this.lanzarbolasegunda = this.crearbolalanzar(this.sys.game.config.width / 2.4, 600);
        this.physics.add.collider(this.lanzarbola, this.burbujasNivel, this.colisionPelotas, null, this);
        gameConfig.bolachocaizquierda = false;
        gameConfig.bolachocaderecha = false;
        }
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





    // primero se detectan las burbujas del techo y luego por descarte las aisladas para borrarlas después
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



    // dado referencia "fila-columna"
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

    moverburbujas() {
        this.burbujasNivel.getChildren().forEach(burbuja => {
            burbuja.y = burbuja.y + 45;
        });
    }

    update() {
        if (this.cursor_space.isDown) {
            // para darle velocidad si la pelota aun no ha sido lanzada
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
            //derecha
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


        if (gameConfig.contador >= 8) {
            gameConfig.graphics = this.add.graphics();
            gameConfig.altura += 45;
            gameConfig.graphics.fillRect(this.sys.game.config.width / 3.2 - 24, this.sys.game.config.height / 10 - 24, 384, gameConfig.altura);
            this.moverburbujas();
            gameConfig.contador = 0;
        }
    }
}