
const config = {
    width: 900,
    height: 600,
    parent: "container",
    type: Phaser.CANVAS,
    scene: [
        Bootloader,
        Sceneplay,
        Inicio,
        GameOver
    ],
    physics: {
        default: "arcade",
        arcade: {
            debug: false 
            //true
        }
    }
}

var game = new Phaser.Game(config);
var gameConfig = {
    numeronivel : 1,
    puntuacionvelocidad: 20000,
    puntos: 0,
    bolachocaizquierda: false,
    bolachocaderecha: false,
    graphics: null,
    velocidadburbujax: 0,
    velocidadburbujay: -900,
    contador: 0,
    arrayburbujas: null,
    nivel: null,
    movimientox: null,
    altura: 0,
    cursors: null,
    crearbola: true,
    proximolanzamiento: true
};