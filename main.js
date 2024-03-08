import Phaser from "phaser";
import perderVida from "@public/js/perderVida";
import recogerFruta from "@public/js/recogerFruta";
import recogerVerdura from "@public/js/recogerVerdura";
import Menuprincipals from "@public/js/MenuPrincipal"


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
    this.load.image("fond2", "images/wall.jpg");
    this.load.image("fondo", "images/fondo.jpg");
    this.load.image("kiwi", "images/kiwi.png");
    this.load.image("durazno", "images/durazno.png");
    this.load.image("Sandia", "images/Sandia.png");
    this.load.image("cesta", "images/cesta.png");
    this.load.audio("sonidoRecogida", "sounds/recojida.mp3");
    this.load.audio("sonidoDaño", "sounds/daño.mp3");
  }

  create() {
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
    this.vidas = 10;
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
    if (cursors.left.isDown) {
      this.cesta.x = Phaser.Math.Clamp(
        this.cesta.x - speed,
        0,
        game.config.width
      );
    } else if (cursors.right.isDown) {
      this.cesta.x = Phaser.Math.Clamp(
        this.cesta.x + speed,
        0,
        game.config.width
      );
    }

    if (restartKey.isDown) {
      this.scene.restart();
    }

    this.physics.add.overlap(this.cesta, this.frutas, recogerFruta, null, this);
    this.physics.add.overlap(
      this.cesta,
      this.verduras,
      recogerVerdura,
      null,
      this
    );
    this.physics.add.overlap(
      this.cesta,
      this.comidaChatarra,
      perderVida,
      null,
      this
    );
    this.textoPuntuacion.setText(
      `Puntuación: ${this.puntuacion} - Vidas: ${this.vidas}`
    );

    if (this.vidas <= 0) {
      this.scene.pause();
      let gameOverText = this.add
        .text(
          game.config.width / 2,
          game.config.height / 2,
          "¡Se te acabaron las vidas!",
          {
            fontSize: "48px",
            color: "#f00",
          }
        )
        .setOrigin(0.5);

      let restartButton = this.add
        .text(
          game.config.width / 2,
          game.config.height / 2 + 100,
          "Reiniciar",
          {
            fontSize: "32px",
            color: "#0f0",
          }
        )
        .setOrigin(0.5)
        .setInteractive();

      restartButton.on("pointerdown", () => {
        this.scene.restart();
      });
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 200 },
    },
  },
  scene: [Menuprincipals, Game],
};

let game = new Phaser.Game(config);
