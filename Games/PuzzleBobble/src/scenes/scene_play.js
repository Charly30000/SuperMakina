var gradosx;
var arrayburbujas;
var nivel;
var cursors;
var flechagirada = false;
var animacionactual = 0;
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

        this.flecha = this.physics.add.sprite(this.sys.game.config.width / 2, 520, 'flecha').setScale(3);
        this.anims.create({ 
            key: 'left', 
            frames: this.anims.generateFrameNumbers('flecha', { start: 0, end: 55 }),
            frameRate: 10,
            // revisar esto por que hace que se repita desde el principio
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'flecha', frame:  animacionactual}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('flecha', { start: 0, end: 55 }),
            frameRate: 10,
            repeat : 0
        });


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
                        arrayburbujas[fila][columna] = fila + "-" + columna;
                        this.burbujasNivel.add(new Burbuja(this, x, y, elemento.burbuja, elemento.color, fila + "-" + columna).setScale(3));
                    }
                    //la fila es de 7
                } else {
                    if (columna == 0) {
                        x = this.sys.game.config.width / 2.95
                    } else {
                        x = x + 48;
                    }
                    if (elemento != " ") {
                        arrayburbujas[fila][columna] = fila + "-" + columna;
                        this.burbujasNivel.add(new Burbuja(this, x, y, elemento.burbuja, elemento.color, fila + "-" + columna).setScale(3));
                    }
                }
                columna++;
            });
        });


        this.colorbolanueva();
        // se crean las dos bolas de lanzar
        this.lanzarbola = this.crearbolalanzar(this.sys.game.config.width / 2, 525);
        this.lanzarbolasegunda = this.crearbolalanzar(this.sys.game.config.width / 2.4, 600);
        this.cursor_space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.physics.add.collider(this.lanzarbola, this.burbujasNivel, this.colisionPelotas, null, this);
        cursors = this.input.keyboard.createCursorKeys();

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
        let xocho = this.sys.game.config.width / 3.2;
        let xsiete = this.sys.game.config.width / 2.95;
        let y = this.sys.game.config.height / 10;
        if (burbujamovil.body.touching.up) {
            if (burbujamovil.x > burbuja.x && coordenadas[0] % 2 != 0) {
                coordenadas[1] = coordenadas[1] + 1;
            }
            coordenadas[0] = coordenadas[0] + 1;
            if (coordenadas[0] % 2 == 0) {
                this.burbujasNivel.add(new Burbuja(this, xocho + coordenadas[1] * 48, y + coordenadas[0] * 45, "burbuja" + color, color, coordenadas[0] + "-" + coordenadas[1]).setScale(3));
            } else {
                this.burbujasNivel.add(new Burbuja(this, xsiete + coordenadas[1] * 48, y + coordenadas[0] * 45, "burbuja" + color, color, coordenadas[0] + "-" + coordenadas[1]).setScale(3));
            }
            burbujamovil.destroy();
            arrayburbujas[coordenadas[0]][coordenadas[1]] = coordenadas[0] + "-" + coordenadas[1];
            this.modificarbolasmoviles();
        } else if (burbujamovil.body.touching.right) {
            burbujamovil.destroy();
            coordenadas[1] = coordenadas[1] - 1;
            if (coordenadas[0] % 2 == 0) {
                this.lanzarbola.x = xocho + coordenadas[1] * 48;
                this.burbujasNivel.add(new Burbuja(this, xocho + coordenadas[1] * 48, y + coordenadas[0] * 45, "burbuja" + color, color, coordenadas[0] + "-" + coordenadas[1]).setScale(3));
            } else {
                this.burbujasNivel.add(new Burbuja(this, xsiete + coordenadas[1] * 48, y + coordenadas[0] * 45, "burbuja" + color, color, coordenadas[0] + "-" + coordenadas[1]).setScale(3));
            }
            this.lanzarbola.y = y + coordenadas[0] * 45;
            this.modificarbolasmoviles();
            arrayburbujas[coordenadas[0]][coordenadas[1]] = coordenadas[0] + "-" + coordenadas[1];
            console.log("derecha");
            console.log(coordenadas[0], coordenadas[1]);
            console.log(arrayburbujas);
        } else if (burbujamovil.body.touching.left) {
            burbujamovil.destroy();
            coordenadas[1] = coordenadas[1] + 1;
            if (coordenadas[0] % 2 == 0) {
                this.burbujasNivel.add(new Burbuja(this, xocho + coordenadas[1] * 48, y + coordenadas[0] * 45, "burbuja" + color, color, coordenadas[0] + "-" + coordenadas[1]).setScale(3));
            } else {
                this.burbujasNivel.add(new Burbuja(this, xsiete + coordenadas[1] * 48, y + coordenadas[0] * 45, "burbuja" + color, color, coordenadas[0] + "-" + coordenadas[1]).setScale(3));
            }
            arrayburbujas[coordenadas[0]][coordenadas[1]] = coordenadas[0] + "-" + coordenadas[1];
            this.modificarbolasmoviles();
            console.log("izquierda");
        }
    }
    modificarbolasmoviles() {
        this.lanzarbola = this.lanzarbolasegunda;
        this.lanzarbola.x = this.sys.game.config.width / 2,
            this.lanzarbola.y = 525;
        this.lanzarbolasegunda = this.crearbolalanzar(this.sys.game.config.width / 2.4, 600);
        this.physics.add.collider(this.lanzarbola, this.burbujasNivel, this.colisionPelotas, null, this);
    }
    update() {

        if (this.cursor_space.isDown) {
            // para darle velocidad si la pelota aun no ha sido lanzada
            if (this.lanzarbola.body.velocity.x == 0 && this.lanzarbola.body.velocity.y == 0) {
                this.lanzarbola.body.velocity.set(-500, -100);
                gradosx = -this.lanzarbola.body.velocity.x;
            }
        }
        // para cambiar la velocidad si choca con el lado izquierdo
        if (this.lanzarbola.x < this.sys.game.config.width / 3.2) {
            this.lanzarbola.body.velocity.set(gradosx, this.lanzarbola.body.velocity.y);
            // para cambiar la velocidad si choca con el lado derecho
        } else if (this.lanzarbola.x > this.sys.game.config.width / 3.2 + 335) {
            this.lanzarbola.body.velocity.set(-gradosx, this.lanzarbola.body.velocity.y);
        }
        if (cursors.left.isDown) {
            if(!flechagirada) {
                this.flecha.flipX =true;
                flechagirada = true;
            } 
            this.flecha.anims.play('left', true);
            animacionactual = 20;
        }
        else if (cursors.right.isDown) {
            if(flechagirada) {
                this.flecha.flipX =false;
                flechagirada = false;
            } 
            this.flecha.anims.play('right', true);
        }
        else {
            this.flecha.anims.play('turn');
        }

        //this.scene.restart();
    }
}