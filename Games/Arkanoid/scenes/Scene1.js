class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        var loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xfcd422 // white
            }
        });
        this.load.on("progress", (percent) => {
            this.add.text(20, 20, "Loading game...");
            console.log(percent * 100);
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
        });
        console.log("hola")

        this.load.image("ladrillo_amarillo", "assets/images/ladrillos/amarillo.png");
    }

    create() {
        // Carga animaciones....
        // Iniciar Scene2
        //this.scene.start("playGame");
    }
}