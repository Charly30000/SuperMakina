class Pelota extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, type) {
        super(scene, x, y, type);
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.world.enable(this);
        this.body.setCollideWorldBounds(true);
        // Rebote de la pelota
        this.body.bounce.set(1);
        // Lo convertimos en circulo...
        //this.body.setCircle(6);

        this.modoBolaRoja = false;
        this.modoPelotaLenta = false;
        this.estaPegada = false;
    }


}

Pelota.prototype.update = function() {
    // Comprobacion de que la pelota no se meta dentro de las barras
    if (this.body.x < this.scene.barraLateralIzda.body.x + this.scene.barraLateralIzda.body.width) {
        this.body.x = this.scene.barraLateralIzda.body.x + this.scene.barraLateralIzda.body.width;
    } else if (this.body.x + this.body.width > this.scene.barraLateralDcha.body.x) {
        this.body.x = this.scene.barraLateralDcha.body.x - this.body.width;
    }

    if (this.body.y < this.scene.barraArriba.body.y + this.scene.barraArriba.body.height) {
        this.body.y = this.scene.barraArriba.body.y + this.scene.barraArriba.body.height;
    }
    
    if (this.body.y > config.height && !this.hayPelotasEnPantalla()) {
        if (gameConfig.vidas > 0){
            this.scene.quitarVida();
            this.scene.colocarPelotaYJugador();
        }
    } else if (this.body.y > config.height && this.hayPelotasEnPantalla()) {
        // Elimina las pelotas que haya fuera de la pantalla en caso de que haya pelotas en la pantalla
        if (!this.hayPelotasPegajosasEnPantalla()) {
            this.scene.listaJugador.getChildren().forEach(jugador => {
                jugador.modoPegajoso = false;
            });
        }
        this.destroy();
    }

    // Lanzar pelota si esta pegada
    if (this.estaPegada && Phaser.Input.Keyboard.JustDown(this.scene.spacebar)) {
        this.scene.listaPelotas.getChildren().forEach(pelota => {
            if (pelota.estaPegada) {
                pelota.body.velocity.set(
                    Phaser.Math.Between(gameConfig.velocidadJugadorX * -1, gameConfig.velocidadJugadorX),
                    gameConfig.velocidadPelotaY);
                pelota.estaPegada = false;
            }
        });
    }
    
}

/* 
    Funcion que comprueba si quedan pelotas en la parte visible de la pantalla.
    Devuelve true o false dependiendo de si encuentra alguna pelota en la pantalla o no
*/
Pelota.prototype.hayPelotasEnPantalla = function() {
    let hayPelotas = false;
    for (let pelota of this.scene.listaPelotas.getChildren()) {
        if (pelota.body.y < config.height) {
            hayPelotas = true;
            break;
        }
    }
    /* this.scene.listaPelotas.getChildren().forEach(pelota => {
        if (pelota.body.y < config.height) {
            hayPelotas = true;
            return;
        }
    }); */
    return hayPelotas;
}

Pelota.prototype.hayPelotasPegajosasEnPantalla = function () {
    for (let pelota of this.scene.listaPelotas.getChildren()) {
        if (pelota.texture.key === "bola_pegajosa") {
            return true;
        }
    }
    return false;
}