class Jugador extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        this.body.immovable = true;
        this.scene = scene;

        this.modoPegajoso = false;
        this.modoPistolero = false;
        this.modoMultipaleta = false;
        this.modoMaximizar = false;
        this.modoMinimizar = false;
        this.mejoraActual = "";

        this.play(`anim_${type}`);
    }
}

Jugador.prototype.update = function() {
    if (!gameConfig.inicioPelota && this.modoPistolero) {
        if (Phaser.Input.Keyboard.JustDown(this.scene.spacebar)) {
            this.scene.listaMisiles.add(
                new Misil(this.scene, this.body.x + 20, this.body.y)
            );
            this.scene.listaMisiles.add(
                new Misil(this.scene, this.body.x + this.body.width - 20, this.body.y)
            );
        }
    }
}