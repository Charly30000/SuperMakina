class Ladrillo extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type, movement) {
        super(scene, x, y, type);
        scene.add.existing(this);
        this.movement = movement;
    }

    // En el caso de que tenga algo que actualizar
    update() {
        
    }
}