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
            debug: false
        }
    }
}
var numeronivel = 1;
var game = new Phaser.Game(config);