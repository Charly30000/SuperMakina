class Ladrillo extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        scene.add.existing(this);
        scene.physics.world.enableBody(true);

        // Hay que añadirlo a una lista de ladrillos, algo como esto
        /* scene.ladrillos.add(this); */
    }

    // En el caso de que tenga algo que actualizar
    /* update() {

    } */
}