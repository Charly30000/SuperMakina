class Scene_play extends Phaser.Scene {
    constructor() {
        super({ key: "Scene_play" })
    }

    create() {
        this.flecha = this.add.sprite(this.sys.game.config.width / 2, 500, 'flechas');
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 57 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1 
        });
        var nivel;
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
        // crea el array de todas las filas del nivel para guardar las referencias de las burbujas
        var arrayburbujas = new Array(this.crearfila(8), this.crearfila(7), this.crearfila(8), this.crearfila(7), this.crearfila(8), this.crearfila(7),
            this.crearfila(8), this.crearfila(7), this.crearfila(8), this.crearfila(7), this.crearfila(8));

        let x = 0;
        let y = 0;
        // recorre todo array de burbujas del nivel , y segun la letra que ponga crea una burbuja de ese color, o deja un espacio vacio
        // en el arrayburbujas
        for (let i = 0; i < nivel.burbuja.length; i++) {
            y = this.sys.game.config.height / 10 + i * 45;
            for (let j = 0; j < nivel.burbuja[i].length; j++) {
                if (i % 2 == 0) {
                    if (j == 0) {
                        x = this.sys.game.config.width / 3.2;
                    } else {
                        x = x + 48;
                    }
                } else {
                    if (j == 0) {
                        x = this.sys.game.config.width / 2.95;
                    } else {
                        x = x + 48;

                    }
                }

                switch (nivel.burbuja[i][j]) {
                    case "Am":
                        arrayburbujas[i][j] = new Burbuja(this, x, y, "burbujaBl", "Am").setScale(3);
                        break;
                    case "Bl":
                        arrayburbujas[i][j] = new Burbuja(this, x, y, "burbujaBl", "Bl").setScale(3);
                        break;
                    case "Gr":
                        arrayburbujas[i][j] = new Burbuja(this, x, y, "burbujaGr", "Gr").setScale(3);
                        break;
                    case "Mo":
                        arrayburbujas[i][j] = new Burbuja(this, x, y, "burbujaMo", "Mo").setScale(3);
                        break;
                    case "Na":
                        arrayburbujas[i][j] = new Burbuja(this, x, y, "burbujaNa", "Na").setScale(3);
                        break;
                    case "Ro":
                        arrayburbujas[i][j] = new Burbuja(this, x, y, "burbujaRo", "Ro").setScale(3);
                        break;
                    case "Ve":
                        arrayburbujas[i][j] = new Burbuja(this, x, y, "burbujaVe", "Ve").setScale(3);
                        break;
                    case "Az":
                        arrayburbujas[i][j] = new Burbuja(this, x, y, "burbujaAz", "Az").setScale(3);
                        break;
                    default:
                        arrayburbujas[i][j] = " ";
                        break;
                }
            }
        }
        // se crean las dos bolas de lanzar
        this.lanzarbola = this.crearbolalanzar(arrayburbujas,this.sys.game.config.width / 2, 525);
        console.log(this.lanzarbola);
        this.lanzarbolasegunda = this.crearbolalanzar(arrayburbujas,this.sys.game.config.width / 2.4,600);
        console.log(arrayburbujas);
        this.cursor_space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    // crea un array con 7 o 8 sitios
    crearfila(numero) {
        if (numero == 7) {
            return [" ", " ", " ", " ", " ", " ", " "];
        } else if (numero == 8) {
            return [" ", " ", " ", " ", " ", " ", " ", " "];
        }
    }


    // mira todo el array de burbujas y devuelve un array con los colores que tiene el array
    colorbolanueva(arrayburbujas) {
        let arrayburbujaslanzar = new Array();
        for (let i = 0; i < arrayburbujas.length; i++) {
            for (let j = 0; j < arrayburbujas[i].length; j++) {
                if (!arrayburbujaslanzar.includes(arrayburbujas[i][j].name) && arrayburbujas[i][j] != " ") {
                    arrayburbujaslanzar.push(arrayburbujas[i][j].name);
                } else {
                    if (arrayburbujaslanzar.length == 8) {
                        break;
                    }
                }
            }
        }
        let posicion = Math.floor(Math.random() * (arrayburbujaslanzar.length - 0)) + 0;
        return arrayburbujaslanzar[posicion];
    }


    // crea una nueva bola con el color que le pasa colorbolanueva
    crearbolalanzar(arrayburbujas,x,y) {
        let colorlanzar = this.colorbolanueva(arrayburbujas);
        return new BurbujaMovil(this, x , y, "burbuja" + colorlanzar, colorlanzar).setScale(3);
        this.annadircolisionburbujas(arrayburbujas);
    }


    annadircolisionburbujas(arrayburbujas) {
        for (let i = 0; i < arrayburbujas.length; i++) {
            for (let j = 0; j < arrayburbujas[i].length; j++) {
                if (arrayburbujas[i][j] != " ") {
                    this.physics.add.collider(this.lanzarbola, arrayburbujas[i][j], this.colisionPelotas, null, this);

                }
            }
        }
    }
    colisionPelotaBorde() {
        console.log("ayuda");
        //this.lanzarbola.body.velocity.set(-110,-120);
    }
    colisionPelotas() {
        console.log("siiii");
    }
    update() {
        var valorx;
        if (this.cursor_space.isDown) {
            this.lanzarbola.body.velocity.set(-110,-10);
            console.log(this.lanzarbola.velocity);
            valorx = -this.lanzarbola.body.velocity.x;
        }
        if(this.lanzarbola.x < this.sys.game.config.width / 3.2) {
            console.log(this.lanzarbola.body.velocity.get());
            this.lanzarbola.body.velocity.set(100, this.lanzarbola.body.velocity.y);
            
        }else if(this.lanzarbola.x > this.sys.game.config.width / 3.2 + 335) {
            this.lanzarbola.body.velocity.set(valorx ,this.lanzarbola.body.velocity.y);
        } 
        //this.scene.restart();
    }
}