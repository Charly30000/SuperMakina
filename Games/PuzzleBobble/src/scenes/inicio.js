class Inicio extends Phaser.Scene {
    constructor() {
        super({ key: "Inicio" })
    }

    create() {
        this.add.image(450, 250, 'inicio');
        this.inicio = this.sound.add("MusicaInicial");
        this.inicio.play();
        this.intervalPressSpace = setInterval(() => {
            let imgPressSpace = this.add.image(config.width / 2, config.height / 2 + 250, "pressSpace");
            setTimeout(() => {
                imgPressSpace.destroy();
            }, 1000);
        }, 2000);


        this.cursor_empezar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        //inicio de la escena del juego
        if (this.cursor_empezar.isDown) {
            this.inicio.stop();
            this.scene.start("Scene_play");
        }

    }
}