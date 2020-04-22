class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        var loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xfcd422 // yellow
            }
        });
        this.load.on("progress", (percent) => {
            this.add.text(20, 20, "Loading game...");
            /* console.log(percent * 100); */
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
        });

        //this.load.image("ladrillo_amarillo", "assets/images/ladrillos/amarillo.png");

        var fs = require('fs');
        /* La lectura del directorio debe de hacerse sincrona, en caso de intentar leerlo de manera asincrona,
        no funcionara, ya que phaser no está preparado para leerlo de esa forma, es decir, la integracion de nodejs
        con phaser es limitada */

        // Carga del directorio de las barras
        var barras = fs.readdirSync(`${__dirname}/assets/images/barras`);
        barras.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.load.image(nombreSinFormato, `assets/images/barras/${element}`);
        });

        // Carga del directorio de los fondos de pantalla
        var fondos = fs.readdirSync(`${__dirname}/assets/images/fondos`);
        fondos.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.load.image(nombreSinFormato, `assets/images/fondos/${element}`);
        });

        // Carga del directorio del jugador
        var jugador = fs.readdirSync(`${__dirname}/assets/images/jugador`);
        /* Por hacer, hay que hacer cargas de los spritesheet que aun no estan puestos para que tenga animacion */
        jugador.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.load.spritesheet(nombreSinFormato, `assets/images/jugador/${element}`, {
                frameWidth: 64,
                frameHeight: 16
            });
        });

        // Carga del directorio de los ladrillos
        var ladrillos = fs.readdirSync(`${__dirname}/assets/images/ladrillos`);
        ladrillos.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            if (nombreSinFormato === "ladrillo_regenerativo" ||
                nombreSinFormato === "ladrillo_indestructible") {
                this.load.spritesheet(nombreSinFormato, `assets/images/ladrillos/${element}`, {
                    frameWidth: 32,
                    frameHeight: 16
                });
            } else {
                this.load.image(nombreSinFormato, `assets/images/ladrillos/${element}`);
            }

        });

        // Carga del directorio de las mejoras
        this.nombreMejoras = fs.readdirSync(`${__dirname}/assets/images/mejoras`);
        this.nombreMejoras.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.load.spritesheet(nombreSinFormato, `assets/images/mejoras/${element}`, {
                frameWidth: 16,
                frameHeight: 8
            });
        });

        // Carga del directorio de los misiles
        var misiles = fs.readdirSync(`${__dirname}/assets/images/misiles`);
        misiles.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.load.image(nombreSinFormato, `assets/images/misiles/${element}`);
        });

        // Carga del directorio de las pelotas
        var pelotas = fs.readdirSync(`${__dirname}/assets/images/pelotas`);
        pelotas.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.load.image(nombreSinFormato, `assets/images/pelotas/${element}`);
        });

        // Carga de los efectos de sonido
        var efectos = fs.readdirSync(`${__dirname}/assets/audio/efectos`);
        efectos.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.load.audio(nombreSinFormato, [`assets/audio/efectos/${element}`]);
        });

        // Carga de la musica del arkanoid
        var musica = fs.readdirSync(`${__dirname}/assets/audio/musica`);
        musica.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.load.audio(nombreSinFormato, [`assets/audio/musica/${element}`]);
        });
    }

    create() {
        // Carga animaciones....
        // Animacion de las mejoras
        this.nombreMejoras.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.anims.create({
                key: `anim_${nombreSinFormato}`,
                frames: this.anims.generateFrameNumbers(nombreSinFormato, {
                    start: 0,
                    end: 8
                }),
                frameRate: 20,
                repeat: -1
            });
        });
        // Animacion ladrillo regenerativo
        this.anims.create({
            key: "anim_ladrillo_regenerativo",
            frames: this.anims.generateFrameNumbers("ladrillo_regenerativo", {
                start: 5,
                end: 0
            }),
            frameRate: 20,
            repeat: 0
        });
        // Animacion ladrillo indestructible
        this.anims.create({
            key: "anim_ladrillo_indestructible",
            frames: this.anims.generateFrameNumbers("ladrillo_indestructible", {
                start: 11,
                end: 0
            }),
            frameRate: 35,
            repeat: 0
        });

        // Animacion jugador normal
        this.anims.create({
            key: "anim_jugador_normal",
            frames: this.anims.generateFrameNumbers("jugador_normal", {
                start: 0,
                end: 16
            }),
            yoyo: true,
            frameRate: 20,
            repeat: -1
        });

        // Animacion jugador destruido
        this.anims.create({
            key: "anim_jugador_destruido",
            frames: this.anims.generateFrameNumbers("jugador_destruido", {
                start: 0,
                end: 4
            }),
            frameRate: 20,
            repeat: 0
        });

        // Iniciar Scene2
        this.scene.start("playGame");
    }
}