class Bootloader extends Phaser.Scene {
    constructor() {
        super({key: "Bootloader"});
    }

    preload() {
        // cuando se terminan de cargar todas las imagenes y los sprite se cambia de escena a la de Inicio
        this.load.on("complete", () => {
            this.scene.start("Inicio");
        })
        var fs = require('fs');

        var burbujas = fs.readdirSync(`${__dirname}/assets/images/bolas`);
        burbujas.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.load.image(nombreSinFormato, `assets/images/bolas/${element}`);
        });

        var fondos = fs.readdirSync(`${__dirname}/assets/images/Backgrounds`);
        fondos.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.load.image(nombreSinFormato, `assets/images/Backgrounds/${element}`);
        });

        var maquinaria = fs.readdirSync(`${__dirname}/assets/images/maquinaria`);
        maquinaria.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.load.image(nombreSinFormato, `assets/images/maquinaria/${element}`);
        });

        var techos = fs.readdirSync(`${__dirname}/assets/images/Techos`);
        techos.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.load.image(nombreSinFormato, `assets/images/Techos/${element}`);
        });

        var efectos = fs.readdirSync(`${__dirname}/assets/audio/efectos`);
        efectos.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.load.audio(nombreSinFormato, [`assets/audio/efectos/${element}`]);
        });
        var musica = fs.readdirSync(`${__dirname}/assets/audio/musica`);
        musica.forEach(element => {
            let nombreSinFormato = element.slice(0, element.indexOf("."));
            this.load.audio(nombreSinFormato, [`assets/audio/musica/${element}`]);
        });


        this.load.image("inicio", "./assets/images/pantallainicial/titulo.png");
        this.load.image("pressSpace", `./assets/images/pantallainicial/pressSpace.png`);
        this.load.image("gameover", "./assets/images/gameover/gameoverscene.png");
        this.load.image("winner", "./assets/images/winner/winner.png");
        this.load.image("escena3", "./assets/images/gameover/Escena3.png");
        

        this.load.spritesheet("dragones1", `./assets/images/dragones/dragones1beta.png`, {
            frameWidth: 29,
            frameHeight: 16
        });
        this.load.spritesheet("dragones2", `./assets/images/dragones/dragones2beta.png`, {
            frameWidth: 26,
            frameHeight: 16
        });
        // crea la barra de porcentaje
        var loadingBar = this.add.graphics({
            fillStyle: {
                color: 0xfcd422 // white
            }
        });
        // mientras esta cargandose todo va mostrando una barra con un procentaje
        this.load.on("progress", (percent)=> {
            this.add.text(20, 20, "Loading game...");
            //console.log(percent * 100);
            loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50);
        })
    }

    create() {

        this.anims.create({
            key: "dragones1",
            frames: this.anims.generateFrameNumbers("dragones1", {
                start: 1,
                end: 13
            }),
            frameRate: 30,
            repeat: 0
        });

        this.anims.create({
            key: "dragones2",
            frames: this.anims.generateFrameNumbers("dragones2", {
                start: 1,
                end: 8
            }),
            frameRate: 30,
            repeat: 0
        });
    }
}