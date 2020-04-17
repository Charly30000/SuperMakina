// de aqui se mueve al Bootloader
const config = {
    width: 900,
    height: 600,
    parent: "container",
    type: Phaser.CANVAS,
    scene: [
        Bootloader,
        Scene_play,
        Inicio
    ],
    physics: {
        default: "arcade",
        arcade: {
            debug: true
        }
    }
}
// variable global que guarda en que nivel estamos en ese momento
var numeronivel = 1;
var game = new Phaser.Game(config);