class Scene_play extends Phaser.Scene {
    constructor() {
        super({ key: "Scene_play" })
    }

    create() {
        // variable que guarda los datos del nivel actual 
        var nivel;
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
        this.add.image(this.sys.game.config.width/2, 300, nivel.borde).setScale(3);

        var arrayburbujas = new Array(new Array(),new Array());
        console.log(nivel.burbuja);
        for(var i=0; i<nivel.burbuja.length; i++) {
            for(var j=0; j<nivel.burbuja[i].length; j++) {
                console.log(nivel.burbuja[i][j]);

                switch (nivel.burbuja[i][j]) {
                    case "Am":
                        arrayburbujas[i][j] = new Burbuja(this, 280, 60, "burbujaAm").setScale(3);
                        break;
                    case "Bl":
                        arrayburbujas[i][j] = new Burbuja(this, 280, 100, "burbujaBl").setScale(3);
                        break;
                    case "Gr":
                        arrayburbujas[i][j] = new Burbuja(this, 60, 90, "burbujaGr").setScale(3);
                        break;
                    case "Mo":
                        arrayburbujas[i][j] = new Burbuja(this, 60, 90, "burbujaMo").setScale(3);
                        break;
                    case "Na":
                        arrayburbujas[i][j] = new Burbuja(this, 60, 90, "burbujaNa").setScale(3);
                        break;
                    case "Ro" :
                        arrayburbujas[i][j] = new Burbuja(this, 60, 90, "burbujaRo").setScale(3);
                        break;
                    case "Ve":
                        arrayburbujas[i][j] = new Burbuja(this, 60, 90, "burbujaVe").setScale(3);
                        break;
                    case " ":
                        arrayburbujas[i][j] = " ";
                        break;
                    default:
                        
                        break;
                }
            }
        }
        console.log(arrayburbujas);
    }

    update() {
        //this.scene.restart();
    }
}