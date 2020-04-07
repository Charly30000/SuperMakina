class Jugador extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        scene.add.existing(this);
        this.modoPegajoso = false;
        this.modoPistolero = false;
        this.modoMultipaleta = false;
        this.modoMaximizar = false;
        this.modoMinimizar = false;
    }
}