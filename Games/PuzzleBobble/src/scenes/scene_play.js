var movx;
var arrayburbujas;
var nivel;
var cursors;
var flecha;
var angulox = 0;
var anguloy = - 900;
var chocaizquierda = false;
var chocaderecha = false;
class Scene_play extends Phaser.Scene {
    constructor() {
        super({ key: "Scene_play" })
    }


    create() {

        //comprueba en la variable global del init en que numero de nivel nos encontramos y coge del nivel(numero).js toda la informacion
        switch (numeronivel) {
            case 1:
                nivel = nivel1;
                break;
            case 2:
                nivel = nivel2;
                break;
            case 3:
                nivel = nivel3;
                break;
            case 4:
                nivel = nivel4;
                break;
            case 5:
                nivel = nivel5;
                break;
            case 6:
                nivel = nivel6;
                break;
            case 7:
                nivel = nivel7;
                break;
            case 8:
                nivel = nivel8;
                break;
            case 9:
                nivel = nivel9;
                break;
            case 10:
                nivel = nivel10;
                break;
            default:
                numeronivel = 1;
                break;
        }



        // se carga el fondo y el borde segun el nivel en el que estas
        this.add.image(450, 300, nivel.fondo).setScale(3);
        this.add.image(this.sys.game.config.width / 2, 300, nivel.borde).setScale(3);

        //se crea la flecha
        this.flecha = this.add.image(this.sys.game.config.width / 1.99, 510, 'flecha').setScale(3);


        // crea el array de todas las filas del nivel para guardar las referencias de las burbujas
        arrayburbujas = new Array(this.crearfila(8), this.crearfila(7), this.crearfila(8), this.crearfila(7), this.crearfila(8), this.crearfila(7),
            this.crearfila(8), this.crearfila(7), this.crearfila(8), this.crearfila(7), this.crearfila(8));


        // se crean las bolas del nivel, guardandolas en un grupo de phaser y guardando una referencia es su lugar del
        // mapa en el array
        let x = 0;
        let y = 0;
        let fila = -1;
        let columna = 0;
        this.burbujasNivel = this.add.group();
        nivel.burbuja.forEach(arrayElementos => {
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
                        arrayburbujas[fila][columna] = fila + "-" + columna + "-" + elemento.color;
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
                        arrayburbujas[fila][columna] = fila + "-" + columna + "-" + elemento.color;
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
        cursors = this.input.keyboard.createCursorKeys();


        // colision entre burbuja movil y el grupo de burbujas
        this.physics.add.collider(this.lanzarbola, this.burbujasNivel, this.colisionPelotas, null, this);

        //let adyacentes = this.burbujasAdyacentes("0-0");
        //console.log(adyacentes);
    }


    // crea un array con 7 o 8 sitios
    crearfila(numero) {
        if (numero == 7) {
            return [" ", " ", " ", " ", " ", " ", " "];
        } else if (numero == 8) {
            return [" ", " ", " ", " ", " ", " ", " ", " "];
        }
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


    // crea una nueva bola con el color que le pasa colorbolanueva
    crearbolalanzar(x, y) {
        let colorlanzar = this.colorbolanueva();
        return new Burbuja(this, x, y, "burbuja" + colorlanzar, colorlanzar, " ").setScale(3);
    }


    //revisar
    colisionPelotas(burbujamovil, burbuja) {
        let color = burbujamovil.name;
        let coordenadas = burbuja.posicion.split("-");
        coordenadas[0] = parseInt(coordenadas[0]);
        coordenadas[1] = parseInt(coordenadas[1]);
        if (burbujamovil.body.touching.up) {
            burbujamovil.destroy();
            if (burbujamovil.x > burbuja.x && coordenadas[0] % 2 != 0) {
                coordenadas[1] = coordenadas[1] + 1;
            }
            coordenadas[0] = coordenadas[0] + 1;
            this.posicionarpelota(coordenadas, color);


        } else if (burbujamovil.body.touching.right) {
            burbujamovil.destroy();
            coordenadas[1] = coordenadas[1] - 1;
            this.posicionarpelota(coordenadas, color);

        } else if (burbujamovil.body.touching.left) {
            burbujamovil.destroy();
            coordenadas[1] = coordenadas[1] + 1;
            this.posicionarpelota(coordenadas, color);
        }
    }


    posicionarpelota(coordenadas, color) {
        let xocho = this.sys.game.config.width / 3.2;
        let xsiete = this.sys.game.config.width / 2.95;
        let y = this.sys.game.config.height / 10;
        if (coordenadas[0] % 2 == 0) {
            this.burbujasNivel.add(new Burbuja(this, xocho + coordenadas[1] * 48, y + coordenadas[0] * 45, "burbuja" + color, color, coordenadas[0] + "-" + coordenadas[1] + "-" + color).setScale(3));
        } else {
            this.burbujasNivel.add(new Burbuja(this, xsiete + coordenadas[1] * 48, y + coordenadas[0] * 45, "burbuja" + color, color, coordenadas[0] + "-" + coordenadas[1] + "-" + color).setScale(3));
        }
        arrayburbujas[coordenadas[0]][coordenadas[1]] = coordenadas[0] + "-" + coordenadas[1] + "-" + color;
        let choquebolas = this.detectarsiexplosion(coordenadas[0] + "-" + coordenadas[1] + "-" + color);
        if (choquebolas.length > 3) {
            this.eliminarbolas(choquebolas);
            let aisladas = this.detectarBurbujasAisladas();
            if (aisladas.length > 0) {
                console.log("hola");
                this.eliminarbolas(aisladas);
            }
        }
        this.modificarbolasmoviles();
    }




    modificarbolasmoviles() {
        this.lanzarbola = this.lanzarbolasegunda;
        this.lanzarbola.x = this.sys.game.config.width / 2,
            this.lanzarbola.y = 525;
        this.lanzarbolasegunda = this.crearbolalanzar(this.sys.game.config.width / 2.4, 600);
        this.physics.add.collider(this.lanzarbola, this.burbujasNivel, this.colisionPelotas, null, this);
        chocaizquierda = false;
        chocaderecha = false;
    }


    eliminarbolas(array) {
        while (array.length != 0) {
            let burbujaarray = array.pop();
            this.burbujasNivel.getChildren().forEach(burbuja => {
                if(burbuja.posicion == burbujaarray) {
                    burbuja.destroy();
                }
            });
            for (let i = 0; i < arrayburbujas.length; i++) {
                for (let j = 0; j < arrayburbujas[i].length; j++) {
                    if(arrayburbujas[i][j] == burbujaarray) {
                        arrayburbujas[i][j] = " ";
                    } 
                }
             
             }
        }
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
        for (let i = 0; i < arrayburbujas[0].length; i++) {
            if (arrayburbujas[0][i] != " ") {
                burbujasAVisitar.push(arrayburbujas[0][i]);
                setBurbujasVisitadas.add(arrayburbujas[0][i]);
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

        arrayburbujas.forEach(fila => {
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
                if ((columna - 1 >= 0) && (arrayburbujas[fila - 1][columna - 1] != " ")) {
                    arrayAdyacentes.push(arrayburbujas[fila - 1][columna - 1]);
                }
                if ((columna <= arrayburbujas[fila - 1].length - 1) && (arrayburbujas[fila - 1][columna] != " ")) {
                    arrayAdyacentes.push(arrayburbujas[fila - 1][columna]);
                }
            }
            // burbujas inferiores
            if (fila + 1 <= arrayburbujas.length) {
                if ((columna - 1 >= 0) && (arrayburbujas[fila + 1][columna - 1] != " ")) {
                    arrayAdyacentes.push(arrayburbujas[fila + 1][columna - 1]);
                }
                if ((columna <= arrayburbujas[fila + 1].length - 1) && (arrayburbujas[fila + 1][columna] != " ")) {
                    arrayAdyacentes.push(arrayburbujas[fila + 1][columna]);
                }
            }
            // fila de 7
        } else {
            // burbujas superiores
            if (arrayburbujas[fila - 1][columna] != " ") {
                arrayAdyacentes.push(arrayburbujas[fila - 1][columna]);
            }
            if (arrayburbujas[fila - 1][columna + 1] != " ") {
                arrayAdyacentes.push(arrayburbujas[fila - 1][columna + 1]);
            }
            // burbujas inferiores
            if (fila + 1 <= arrayburbujas.length) {
                if (arrayburbujas[fila + 1][columna] != " ") {
                    arrayAdyacentes.push(arrayburbujas[fila + 1][columna]);
                }
                if (arrayburbujas[fila + 1][columna + 1] != " ") {
                    arrayAdyacentes.push(arrayburbujas[fila + 1][columna + 1]);
                }
            }
        }
        // burbujas laterales
        if ((columna - 1 >= 0) && (arrayburbujas[fila][columna - 1] != " ")) {
            arrayAdyacentes.push(arrayburbujas[fila][columna - 1]);
        }
        if ((columna < arrayburbujas[fila].length - 1) && (arrayburbujas[fila][columna + 1] != " ")) {
            arrayAdyacentes.push(arrayburbujas[fila][columna + 1]);
        }
        return arrayAdyacentes;
    }











    update() {
        if (this.cursor_space.isDown) {
            // para darle velocidad si la pelota aun no ha sido lanzada
            if (this.lanzarbola.body.velocity.x == 0 && this.lanzarbola.body.velocity.y == 0) {
                this.lanzarbola.body.velocity.set(angulox, anguloy);
                movx = -this.lanzarbola.body.velocity.x;
            }
        }
        // para cambiar la velocidad si choca con el lado izquierdo
        if (this.lanzarbola.x < this.sys.game.config.width / 3.2) {
            if (chocaderecha) {
                movx = -movx;
            }
            this.lanzarbola.body.velocity.set(movx, this.lanzarbola.body.velocity.y);
            chocaizquierda = true;
            chocaderecha = false;
            // para cambiar la velocidad si choca con el lado derecho
        } else if (this.lanzarbola.x > this.sys.game.config.width / 3.2 + 335) {
            if (chocaizquierda) {
                movx = -movx;
            }
            this.lanzarbola.body.velocity.set(movx, this.lanzarbola.body.velocity.y);
            chocaizquierda = false;
            chocaderecha = true;
        }
        if (cursors.left.isDown) {
            if (angulox < 0) {
                anguloy += 10;
            } else {
                anguloy -= 10;
            }
            angulox -= 10;
            this.flecha.angle--;

        } else if (cursors.right.isDown) {
            //derecha
            if (angulox > 0) {
                anguloy += 10;
            } else {
                anguloy -= 10;
            }
            angulox += 10;
            this.flecha.angle++;

        }
        //this.scene.restart();
    }
}