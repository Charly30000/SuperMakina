class BurbujaMovil extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type,name) {
        super(scene, x, y, type);
        scene.add.existing(this);
        scene.physics.world.enableBody(this);
        this.body.immovable = true;
        this.body.setCollideWorldBounds(true);
        this.name = name;
        //this.body.bounce.set(1);
        //this.body.velocity.set(-180);
    }
}