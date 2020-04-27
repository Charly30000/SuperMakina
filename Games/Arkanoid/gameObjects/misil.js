class Misil extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "misil");
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.velocity.y = -400;
    }
}

Misil.prototype.update = function() {
    if (this.body.y < 0) { 
        this.destroy();
        console.log("misil destruido");
    }
}