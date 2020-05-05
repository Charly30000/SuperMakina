class Scene3 extends Phaser.Scene {
    constructor() {
        super("gameOver");
    }

    create() {
        this.add.text(20, 20, `Puntos: ${gameConfig.puntos}`);
        /* localStorage.setItem("Arkanoid", JSON.stringify(
            [
                { "nombre": "alb", "puntuacion": 123123123 }, 
                { "nombre": "nbc", "puntuacion": 242352 }, 
                { "nombre": "san", "puntuacion": 123312 }, 
                { "nombre": "dfb", "puntuacion": 13123 }, 
                { "nombre": "mjm", "puntuacion": 6573 }, 
                { "nombre": "asd", "puntuacion": 5673 }, 
                { "nombre": "asd", "puntuacion": 5673 }, 
                { "nombre": "asd", "puntuacion": 5673 }, 
                { "nombre": "asd", "puntuacion": 5673 }, 
                { "nombre": "asd", "puntuacion": 5673 }
            ]
        )); */
        var puntuaciones = JSON.parse(localStorage.getItem("Arkanoid"));
        puntuaciones.push({nombre: "Nuevo!", puntuacion: gameConfig.puntos})
        puntuaciones.sort((a, b) => {
            if (a.puntuacion > b.puntuacion) {
                return -1;
            } else if (a.puntuacion < b.puntuacion) {
                return 1;
            } else {
                return 0;
            }
        });

        var posY = 80;
        var posicionTabla = 1;
        this.posNuevo;
        puntuaciones.forEach(puntuacion => {
            if (puntuacion.nombre === "Nuevo!"){
                if (posicionTabla == 11) {
                    this.add.text(20, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString().padEnd(15, ".")}${puntuacion.puntuacion}`, {color: '#E74C3C'});
                } else {
                    this.add.text(20, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString().padEnd(15, ".")}${puntuacion.puntuacion}`, {color: '#2E86C1'});
                }
                this.posNuevo = posicionTabla;
            } else if (posicionTabla == 11){
                this.add.text(20, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString().padEnd(15, ".")}${puntuacion.puntuacion}`, {color: '#E74C3C'});
            } else {
                this.add.text(20, posY, `${posicionTabla.toString().padStart(3, " ")}º   ${puntuacion.nombre.toString().padEnd(15, ".")}${puntuacion.puntuacion}`);
            }
            posY += 40;
            posicionTabla++;
        });
        this.spacebar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.add.text(20, config.height - 50, "Press Space to continue....");
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.spacebar)) {
            if (this.posNuevo != 11) {
                // Crea el modal y guarda las puntuaciones
                /* ALBERTO CURRA POR AQUI */
            } else {
                // Se reinicia el juego
                this.scene.start("playGame");
                this.scene.stop();
                gameConfig.puntos = 0;
            }
        } 
    }
}