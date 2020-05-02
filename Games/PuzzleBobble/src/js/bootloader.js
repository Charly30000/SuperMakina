class Bootloader extends Phaser.Scene {
    constructor() {
        super({key: "Bootloader"});
    }

    preload() {
        // cuando se terminan de cargar todas las imagenes y los sprite se cambia de escena a la de Inicio
        this.load.on("complete", () => {
            this.scene.start("Inicio");
        })

        this.load.image("burbujaAm", "./assets/images/bolas/bolaamarilla.png");
        this.load.image("burbujaAz", "./assets/images/bolas/bolaazul.png");
        this.load.image("burbujaBl", "./assets/images/bolas/bolablanca.png");
        this.load.image("burbujaGr", "./assets/images/bolas/bolagris.png");
        this.load.image("burbujaMo", "./assets/images/bolas/bolamorada.png");
        this.load.image("burbujaNa", "./assets/images/bolas/bolanaranja.png");
        this.load.image("burbujaRo", "./assets/images/bolas/bolaroja.png");
        this.load.image("burbujaVe", "./assets/images/bolas/bolaverde.png");
        this.load.image('flecha','./assets/images/flechas/flechaprueba.png');
        this.load.image("inicio", "./assets/images/pantallainicial/titulo.jpg");
        this.load.image("lineago", "./assets/images/Backgrounds/linea_game_over.png");
        this.load.image("fondo1-3", "./assets/images/Backgrounds/Background 1-3.png");
        this.load.image("fondo4-6", "./assets/images/Backgrounds/Background 4-6.png");
        this.load.image("fondo7-9", "./assets/images/Backgrounds/Background 7-9.png");
        this.load.image("fondo10-12", "./assets/images/Backgrounds/Background 10-12.png");
        this.load.image("borde1-3", "./assets/images/Backgrounds/Borders 1-3.png");
        this.load.image("borde4-6", "./assets/images/Backgrounds/Borders 4-6.png");
        this.load.image("borde7-9", "./assets/images/Backgrounds/Borders 7-9.png");
        this.load.image("borde10-12", "./assets/images/Backgrounds/Borders 10-12.png");
        // sin probar
        this.load.image("techoInferior1-3", "./assets/images/Techos/techo inferior 1-3.png");
        this.load.image("techoInferior4-6", "./assets/images/Techos/techo inferior 4-6.png");
        this.load.image("techoInferior7-9", "./assets/images/Techos/techo inferior 7-9.png");
        this.load.image("techoInferior10-12", "./assets/images/Techos/techo inferior 10-12.png");
        this.load.image("techoAdicional1-3", "./assets/images/Techos/techo adicional 1-3.png");
        this.load.image("techoAdicional4-6", "./assets/images/Techos/techo adicional 4-6.png");
        this.load.image("techoAdicional7-9", "./assets/images/Techos/techo adicional 7-9.png");
        this.load.image("techoAdicional10-12", "./assets/images/Techos/techo adicional 10-12.png");
        
        this.load.spritesheet("maquinaria", `./assets/images/flechas/maquinaria.png`, {
            frameWidth: 60,
            frameHeight: 35
        });

        this.load.spritesheet("rueda", `./assets/images/flechas/rueda.png`, {
            frameWidth: 34,
            frameHeight: 17
        });

        this.load.spritesheet("dragones1", `./assets/images/dragones/dragones1.png`, {
            frameWidth: 60,
            frameHeight: 35
        });
        this.load.spritesheet("dragones2", `./assets/images/dragones/dragones2.png`, {
            frameWidth: 60,
            frameHeight: 35
        });
        // crea la barra de porcentaje
        var loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xfcd422 // white
            }
        });
        // mientras esta cargandose todo va mostrando una barra con un procentaje
        this.load.on("progress", (percent)=> {
            this.add.text(20, 20, "Loading game...");
            //console.log(percent * 100);
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
        })
    }

    create() {
        this.anims.create({
            key: "maquinariagiro",
            frames: this.anims.generateFrameNumbers("maquinaria", {
                start: 0,
                end: 12
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "rueda",
            frames: this.anims.generateFrameNumbers("rueda", {
                start: 0,
                end: 1
            }),
            frameRate: 20,
            repeat: 0
        });
        this.anims.create({
            key: "dragones1",
            frames: this.anims.generateFrameNumbers("dragones1", {
                start: 11,
                end: 5
            }),
            frameRate: 20,
            repeat: 0
        });

        this.anims.create({
            key: "dragones2",
            frames: this.anims.generateFrameNumbers("dragones2", {
                start: 0,
                end: 8
            }),
            frameRate: 20,
            repeat: 0
        });
    }
}