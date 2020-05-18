var config = {
    width: 400,
    height: 600,
    parent: "container",
    type: Phaser.CANVAS,
    scene: [bootGame, playGame, gameOver],
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
    nivel : 1,
    puntos: 0,
    vidas: 3,
    inicioPelota: true,
    velocidadPelotaY: -200,
    velocidadJugadorX: 300,
    posicionJugadorX: config.width / 2,
    posicionJugadorY: config.height - 50,
    posicionPelotaX: config.width / 2,
    posicionPelotaY: config.height - 50 - 16,
    velocidadMinimaPelotaX: 70,
    haGanado: false
};

var sonidoGana;

var game = new Phaser.Game(config);