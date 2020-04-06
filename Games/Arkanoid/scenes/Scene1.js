class Scene1 extends Phaser.Scene {
    constructor() {
        super("bootGame");
    }

    preload() {
        var loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xfcd422 // white
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

        // Carga del directorio de los ladrillos
        var ladrillos = fs.readdirSync(`${__dirname}/assets/images/ladrillos`);
        ladrillos.forEach(element => {
                let nombreSinFormato = element.slice(0, element.indexOf("."));
                this.load.image(nombreSinFormato, `assets/images/ladrillos/${element}`);
        });

        // Carga del directorio de las mejoras
        /*************************************************************
            HAY QUE DETALLAR BIEN EL ANCHO Y EL ALTO DE LAS MEJORAS
        **************************************************************/
        var mejoras = fs.readdirSync(`${__dirname}/assets/images/mejoras`);
        mejoras.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.load.spritesheet(nombreSinFormato, `assets/images/mejoras/${element}`, {
                frameWidth: 16,
                frameHeight: 16
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
        // Iniciar Scene2
        //this.scene.start("playGame");
    }
}