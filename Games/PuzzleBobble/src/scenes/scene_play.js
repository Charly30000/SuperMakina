class Scene_play extends Phaser.Scene {
    constructor() {
        super({ key: "Scene_play" })
    }

    create() {
        // variable que guarda los datos del nivel actual 
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
        var arrayburbujas = new Array([], [], [], [], [], [], [], [], [], [], []);

        let x = 0;
        let y = 0;
        // recorre todo array de burbujas del nivel , y segun la letra que ponga crea una burbuja de ese color, o deja un espacio vacio
        // en el arrayburbujas
        for (let i = 0; i < nivel.burbuja.length; i++) {
            y = this.sys.game.config.width / 15 + i * 47;
            for (let j = 0; j < nivel.burbuja[i].length; j++) {
                if (i % 2 == 0) {
                    if (j == 0) {
                        x = this.sys.game.config.width / 3.2;
                    } else {
                        x = x + 48;
                    }
                } else {
                    if (j == 0) {
                        x = this.sys.game.config.width / 3;
                    } else {
                        x = x + 49;

                    }
                }
                console.log(nivel.burbuja[i][j]);

                switch (nivel.burbuja[i][j]) {
                    case "Am":
                        arrayburbujas[i][j] = new Burbuja(this, x, y, "burbujaAm").setScale(3);
                        // les pongo de name al objeto la inicial de su color , para saber su color
                        arrayburbujas[i][j].name = "Am";
                        break;
                    case "Bl":
                        arrayburbujas[i][j] = new Burbuja(this, x, y, "burbujaBl").setScale(3);
                        arrayburbujas[i][j].name = "Bl";
                        break;
                    case "Gr":
                        arrayburbujas[i][j] = new Burbuja(this, x, y, "burbujaGr").setScale(3);
                        arrayburbujas[i][j].name = "Gr";
                        break;
                    case "Mo":
                        arrayburbujas[i][j] = new Burbuja(this, x, y, "burbujaMo").setScale(3);
                        arrayburbujas[i][j].name = "Mo";
                        break;
                    case "Na":
                        arrayburbujas[i][j] = new Burbuja(this, x, y, "burbujaNa").setScale(3);
                        arrayburbujas[i][j].name = "Na";
                        break;
                    case "Ro":
                        arrayburbujas[i][j] = new Burbuja(this, x, y, "burbujaRo").setScale(3);
                        arrayburbujas[i][j].name = "Ro";
                        break;
                    case "Ve":
                        arrayburbujas[i][j] = new Burbuja(this, x, y, "burbujaVe").setScale(3);
                        arrayburbujas[i][j].name = "Ve";
                        break;
                    default:
                        arrayburbujas[i][j] = " ";
                        break;
                }
            }
        }


    }
    // sin terminar
    crearbolalanzar() {
        let arrrayburbujaslanzar = new Array();
        for (let i = 0; i < arrayburbujas.length; i++) {
            for (let j = 0; j < arrayburbujas[i].length; j++) {
                
            }
        }
    }

    update() {
        //this.scene.restart();
    }
}