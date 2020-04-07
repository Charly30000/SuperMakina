class Pelota extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        scene.add.existing(this);
        this.modoBolaRoja = false;
        this.modoPelotaLenta = false;
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
    }

    update() {

    }
}