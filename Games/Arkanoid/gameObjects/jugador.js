class Jugador extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.body.immovable = true;

        this.modoPegajoso = false;
        this.modoPistolero = false;
        this.modoMultipaleta = false;
        this.modoMaximizar = false;
        this.modoMinimizar = false;

        this.play("anim_jugador_normal");
    }
}