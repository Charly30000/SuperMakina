class Pelota extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        // Rebote de la pelota
        this.body.bounce.set(1);
        // Velocidad de la pelota
        //this.body.setVelocity(Phaser.Math.Between(-120, 120), -200);
        this.body.velocity.set(/* Phaser.Math.Between(-120, 120) */250, gameConfig.velocidadPelotaY);
        // Lo convertimos en circulo...
        //this.body.setCircle(6);

        this.modoBolaRoja = false;
        this.modoPelotaLenta = false;
    }

    update() {
        if (this.body.y > config.height) {
            this.body.y = config.height/2;
            this.body.x = config.width/2;
            this.scene.quitarVida();
        }
    }
}