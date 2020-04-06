var config = {
    width: 400,
    height: 600,
    parent: "container",
    type: Phaser.CANVAS,
    scene: [Scene1, Scene2],
    pixelArt: true,
    physics: {
        default: "arcade",
        arcade: {
            debug: false
        }
    },
    backgroundColor: 0x000000
}

var nivel = 1;

var game = new Phaser.Game(config);