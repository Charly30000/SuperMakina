import Palas from '../gameObjects/burbuja.js'
class Scene_play extends Phaser.Scene {
    constructor() {
        super({ key: "Scene_play" })
    }

    create() {
        this.add.image(450, 300, 'fondo1-3').setScale(3);
        this.add.image(this.sys.game.config.width/2, 300, 'borde1-3').setScale(3);
    }

    update() {


    }
}

export default Scene_play;