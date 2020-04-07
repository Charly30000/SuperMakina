import Bootloader from './bootloader.js';
import Scene_play from '../scenes/scene_play.js';
import Inicio from '../scenes/inicio.js';
const config = {
    width: 900,
    height: 600,
    parent: "container",
    type: Phaser.CANVAS,
    physics: {
        default: "arcade"
    },
    scene: [
        Bootloader,
        Scene_play,
        Inicio
    ]
}

var game = new Phaser.Game(config);