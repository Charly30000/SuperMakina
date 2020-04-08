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

var gameConfig = {
    nivel : 11,
    puntos: 0,
    velocidadPelotaY: -200,
    velocidadJugadorX: 300,
    posicionJugadorX: config.width / 2,
    posicionJugadorY: config.height - 50
};

var game = new Phaser.Game(config);