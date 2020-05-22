class LadrilloRegenerativo extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type, movement) {
        super(scene, x, y, type);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.immovable = true;
        this.body.setCollideWorldBounds(true);
        
        this.movement = movement;
        this.puntos = 50;
        this.golpes = 3;
        this.tieneMejora = false;
    }
}