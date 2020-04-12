class Burbuja extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type,name, sitio) {
        super(scene, x, y, type);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.immovable = true;
        this.body.setCollideWorldBounds(true);
        this.name = name;
        this.x = x;
        this.y = y;
        this.posicion = sitio;
    }
}