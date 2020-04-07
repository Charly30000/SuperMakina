class Burbuja extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        this.body.immovable = true;
        this.body.setCollideWorldBounds(true);
        scene.add.existing(true);
        scene.physics.world.enable(this);
    }
}
export default Burbuja;