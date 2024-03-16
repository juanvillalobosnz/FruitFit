import Phaser from "phaser";
import perderVida from "@assets/scripts/perderVida";
import recogerFruta from "@assets/scripts/recogerFruta";
import recogerVerdura from "@assets/scripts/recogerVerdura";
import Menuprincipals from "@assets/scripts/MenuPrincipal";
import GameOver from "./assets/scripts/GameOver";


let cursors;
let restartKey;

class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
  }

  preload() {
    // Agrega un evento de 'progress' para mostrar el progreso de la carga
    this.load.on("progress", function (value) {
      console.log(`Progreso de carga: ${value * 100}%`);
    });

    // Agrega un evento de 'fileprogress' para mostrar el progreso de cada archivo
    this.load.on("fileprogress", function (file) {
      console.log(`Cargando archivo: ${file.key}`);
    });

    // Agrega un evento de 'complete' para indicar cuando se ha completado la carga
    this.load.on("complete", function () {
      console.log("Carga completa");
    });

    // Ahora carga tus archivos
    this.load.image("fondo", "assets/images/wall.png");
    this.load.image("kiwi", "assets/images/kiwi.png");
    this.load.image("durazno", "assets/images/durazno.png");
    this.load.image("Sandia", "assets/images/Sandia.png");
    this.load.image("cesta", "assets/images/cesta.png");
    this.load.audio("sonidoRecogida", "assets/audio/recojida.mp3");
    this.load.audio("sonidoDaño", "assets/audio/daño.mp3");
  }

  create() {
    
    this.input.on('pointermove', function (pointer) {
      this.cesta.x = pointer.x;
    }, this);

    let gameWidth = this.sys.game.config.width;
    let gameHeight = this.sys.game.config.height;

    let fondo = this.add.image(0, 0, "fondo");
    let scaleFactor = Math.min(
      gameWidth / fondo.width,
      gameHeight / fondo.height
    );
    fondo.setScale(scaleFactor);
    fondo.setPosition(gameWidth / 2, gameHeight / 2);

    this.cesta = this.physics.add
      .image(400, 500, "cesta")
      .setCollideWorldBounds(true)
      .setScale(0.5);

    this.frutas = this.physics.add.group({
      key: "kiwi",
      repeat: 9, // Esto creará 10 imágenes en total (1 base + 9 repetidas)
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.verduras = this.physics.add.group({
      key: "durazno",
      repeat: 9,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    this.comidaChatarra = this.physics.add.group({
      key: "Sandia",
      repeat: 4,
      setXY: { x: 12, y: 0, stepX: 70 },
    });

    Phaser.Actions.RandomRectangle(
      this.frutas.getChildren(),
      new Phaser.Geom.Rectangle(100, 100, 600, 300)
    );
    Phaser.Actions.RandomRectangle(
      this.verduras.getChildren(),
      new Phaser.Geom.Rectangle(100, 100, 600, 300)
    );
    Phaser.Actions.RandomRectangle(
      this.comidaChatarra.getChildren(),
      new Phaser.Geom.Rectangle(100, 100, 600, 300)
    );

    this.puntuacion = 0;
    this.vidas = 3;
    this.textoPuntuacion = this.add.text(
      100,
      50,
      `Puntuación: ${this.puntuacion} - Vidas: ${this.vidas}`,
      {
        fontSize: "24px",
        color: "#fff",
      }
    );

    cursors = this.input.keyboard.createCursorKeys();
    restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
  }

  update() {
    let speed = 10;
    if (cursors.left.isDown || this.input.activePointer.isDown && this.input.x < this.cesta.x) {
      this.cesta.x = Phaser.Math.Clamp(
        this.cesta.x - speed,
        0,
        this.sys.game.config.width
      );
    } else if (cursors.right.isDown || this.input.activePointer.isDown && this.input.x > this.cesta.x) {
      this.cesta.x = Phaser.Math.Clamp(
        this.cesta.x + speed,
        0,
        this.sys.game.config.width
      );
    }
  
    this.physics.add.overlap(this.cesta, this.frutas, recogerFruta, null, this);
    this.physics.add.overlap(this.cesta, this.verduras, recogerVerdura, null, this);
    this.physics.add.overlap(this.cesta, this.comidaChatarra, perderVida, null, this);
  
    this.textoPuntuacion.setText(`Puntuación: ${this.puntuacion} - Vidas: ${this.vidas}`);
    this.textoPuntuacion.setFontSize('32px');
    this.textoPuntuacion.setPosition(this.sys.game.config.width / 2, 50);
    this.textoPuntuacion.setOrigin(0.5);
  
    if (this.vidas <= 0) {
      this.scene.start('GameOver');
    }
    
  }
  
}

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.CENTER_VERTICALLY,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 200 },
    },
  },
  scene: [Menuprincipals, Game,GameOver],
};

let game = new Phaser.Game(config);

