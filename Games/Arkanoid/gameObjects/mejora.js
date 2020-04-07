class Mejora extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        // Se añade la escena de la mejora
        scene.add.existing(this);
        // Para que tenga fisicas el objeto
        scene.physics.world.enableBody(true);
        // Activamos la animacion
        this.play(`anim_${type}`);
        this.body.velocity.y = -100;
    }

    update() {
        if (this.y > config.height) {
            this.destroy();
        }
    }
}