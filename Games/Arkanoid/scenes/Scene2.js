class Scene2 extends Phaser.Scene {
    constructor() {
        super("playGame");
    }

    create() {
        // Seleccion de nivel
        var cargaNivel;
        switch (nivel) {
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
                nivel = 1;
                this.scene.restart();
                break;
        }

        // Colocacion del fondo
        /************** 
            POR HACER
        ***************/

        // Colocacion de barras
        this.listaBarras = this.physics.add.staticGroup();
        this.listaBarras.add(this.add.sprite(30, 48, "barra_arriba").setOrigin(0, 0));
        this.listaBarras.add(this.add.sprite(0, 68, "barra_lateralizda").setOrigin(0, 0));
        this.listaBarras.add(this.add.sprite(376, 68, "barra_lateraldcha").setOrigin(0, 0));
        this.listaBarras.add(this.add.sprite(366, 49, "barra_girodcha").setOrigin(0, 0));
        this.listaBarras.add(this.add.sprite(0, 49, "barra_giroizda").setOrigin(0, 0));

        // Parte de las puntuaciones
        var graphics = this.add.graphics();
        graphics.fillStyle("Black");
        graphics.fillRect(0, 0, config.width, 48);

        // Sistema de colocacion de ladrillos
        var posX = 40;
        var posY = 80;
        this.listaLadrillos = this.physics.add.group();
        cargaNivel.ladrillos.forEach(arrayLadrillos => {
            arrayLadrillos.forEach(element => {
                if (element.ladrillo){
                    this.listaLadrillos.add(new Ladrillo(this, posX, posY, element.ladrillo, element.movement));
                }
                posX += 32;
            });
            posX = 40;
            posY += 16;
        });

        // Pelotas
        this.listaPelotas = this.physics.add.group();
        this.listaPelotas.add(new Pelota(this, config.width / 2, config.height / 2, "bola_roja"));
        this.listaPelotas.setVelocity(Phaser.Math.Between(-120, 120), Phaser.Math.Between(-120, 120));
        
        // Jugador

        /**************** 
            COLISIONES
        *****************/
        // Colisiones pelota
        this.physics.add.collider(this.listaPelotas, this.listaLadrillos, function(pelota, ladrillo) {
            ladrillo.destroy();
        });
        this.physics.add.collider(this.listaPelotas, this.listaBarras);
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
    }
}