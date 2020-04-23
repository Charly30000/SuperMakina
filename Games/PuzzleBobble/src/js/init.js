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
            debug: false
            //true
        }
    }
}
// variable global que guarda en que nivel estamos en ese momento

var game = new Phaser.Game(config);
var gameConfig = {
    numeronivel : 1,
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
    cursors: null
};