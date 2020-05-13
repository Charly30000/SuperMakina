//se muestra una imagen inicial del juego, la cual tendremos que cambiar,para empezar el juego hay que
//pulsar la s y te mueve a Scene_play
class Inicio extends Phaser.Scene {
    constructor() {
        super({ key: "Inicio" })
    }

    create() {
        this.add.image(450, 250, 'inicio');
        //this.scoreLabel = this.add.text(300, 550, `Presiona Espacio para comenzar`);
        this.intervalPressSpace = setInterval(() => {
            let imgPressSpace = this.add.image(config.width / 2, config.height / 2 + 250, "pressSpace");
            setTimeout(() => {
                imgPressSpace.destroy();
            }, 1000);
        }, 2000);

        this.cursor_empezar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (this.cursor_empezar.isDown) {
            this.scene.start("Scene_play");
        }

    }
}