//se muestra una imagen inicial del juego, la cual tendremos que cambiar,para empezar el juego hay que
//pulsar la s y te mueve a Scene_play
class Inicio extends Phaser.Scene {
    constructor() {
        super({ key: "Inicio" })
    }

    create() {
        this.add.image(450, 300, 'inicio').setScale(0.6);
        this.cursor_S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    }

    update() {
        if (this.cursor_S.isDown) {
            this.scene.start("Scene_play");
        }

    }
}