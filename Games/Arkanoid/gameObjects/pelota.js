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
        //this.body.velocity.set(Phaser.Math.Between(-120, 120), gameConfig.velocidadPelotaY);
        // Lo convertimos en circulo...
        //this.body.setCircle(6);

        this.modoBolaRoja = false;
        this.modoPelotaLenta = false;
    }


}

Pelota.prototype.update = function() {
    if (this.body.y > config.height && !this.hayPelotasEnPantalla()) {
        this.scene.quitarVida();
        this.scene.colocarPelotaYJugador();
    } else if (this.body.y > config.height && this.hayPelotasEnPantalla()) {
        // Elimina las pelotas que haya fuera de la pantalla en caso de que haya pelotas en la pantalla
        this.destroy();
    }
    
}

/* 
    Funcion que comprueba si quedan pelotas en la parte visible de la pantalla.
    Devuelve true o false dependiendo de si encuentra alguna pelota en la pantalla o no
*/
Pelota.prototype.hayPelotasEnPantalla = function() {
    let hayPelotas = false;
    this.scene.listaPelotas.getChildren().forEach(pelota => {
        if (pelota.body.y < config.height) {
            hayPelotas = true;
            return;
        }
    });
    return hayPelotas;
}