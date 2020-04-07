class Bootloader extends Phaser.Scene {
    constructor() {
        super({key: "Bootloader"});
    }

    preload() {
        this.load.on("complete", () => {
            this.scene.start("Inicio");
        })

        this.load.image("burbujaAm", "./assets/images/bolas/bolaamarilla.png");
        this.load.image("burbujaBl", "./assets/images/bolas/bolablanca.png");
        this.load.image("burbujaGr", "./assets/images/bolas/bolagris.png");
        this.load.image("burbujaMo", "./assets/images/bolas/bolamorada.png");
        this.load.image("burbujaNa", "./assets/images/bolas/bolanaranja.png");
        this.load.image("burbujaRo", "./assets/images/bolas/bolaroja.png");
        this.load.image("burbujaVe", "./assets/images/bolas/bolaverde.png");
        this.load.image("inicio", "./assets/images/pantallainicial/titulo.jpg");
        this.load.image("fondo1-3", "./assets/images/Backgrounds/Background 1-3.bmp");
        this.load.image("fondo4-6", "./assets/images/Backgrounds/Background 4-6.bmp");
        this.load.image("fondo7-9", "./assets/images/Backgrounds/Background 7-9.bmp");
        this.load.image("fondo10-12", "./assets/images/Backgrounds/Background 10-12.bmp");
        this.load.image("borde1-3", "./assets/images/Backgrounds/Borders 1-3.png");
        this.load.image("borde4-6", "./assets/images/Backgrounds/Borders 4-6.png");
        this.load.image("borde7-9", "./assets/images/Backgrounds/Borders 7-9.bmp");// problemas con este
        this.load.image("borde10-12", "./assets/images/Backgrounds/Borders 10-12.bmp"); // problemas con este

        var loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xfcd422 // white
            }
        });
        this.load.on("progress", (percent)=> {
            this.add.text(20, 20, "Loading game...");
            //console.log(percent * 100);
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
        })
    }
}