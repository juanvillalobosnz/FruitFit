import Phaser from "phaser";
import perderVida from "@assets/scripts/perderVida";
import recogerFruta from "@assets/scripts/recogerFruta";
import recogerVerdura from "@assets/scripts/recogerVerdura";
import Menuprincipals from "@assets/scripts/MenuPrincipal";
import GameOver from "@assets/scripts/GameOver";
import { recursos } from "@assets/scripts/recursos";

class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
    this.cursors = null;
    this.restartKey = null;
  }

  handlePointerMove(pointer) {
    this.cesta.x = Phaser.Math.Clamp(pointer.x, 0, this.sys.game.config.width);
  }

  createGroup(key, repeat) {
    return this.physics.add.group({
      key: key,
      repeat: repeat,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
  }

  preload() {
    // Ahora carga tus archivos
    const IMAGEN_FONDO = "fondo";
    const IMAGEN_KIWI = "kiwi";
    const IMAGEN_DURAZNO = "durazno";
    const IMAGEN_COMIDA_CHATARRA = "Sandia";
    const IMAGEN_CESTA = "cesta";
    const SONIDO_RECOGIDA = "sonidoRecogida";
    const SONIDO_DAÑO = "sonidoDaño";

    // Ahora carga tus archivos
    this.load.image(IMAGEN_FONDO, recursos.imagenes.fondo);
    this.load.image(IMAGEN_KIWI, recursos.imagenes.kiwi);
    this.load.image(IMAGEN_DURAZNO, recursos.imagenes.durazno);
    this.load.image(IMAGEN_COMIDA_CHATARRA, recursos.imagenes.sandia);
    this.load.image(IMAGEN_CESTA, recursos.imagenes.cesta);
    this.load.audio(SONIDO_RECOGIDA, recursos.audio.sonidoRecogida);
    this.load.audio(SONIDO_DAÑO, recursos.audio.sonidoDaño);
  }

  create() {
    let gameWidth = this.sys.game.config.width;
    let gameHeight = this.sys.game.config.height;

    // Fondo
    let fondo = this.add.image(0, 0, "fondo").setOrigin(0, 0);
    let scaleFactor = Math.max(
      gameWidth / fondo.width,
      gameHeight / fondo.height
    );
    fondo.setScale(scaleFactor);

    // Cesta
    this.cesta = this.physics.add
      .image(400, 500, "cesta")
      .setCollideWorldBounds(true)
      .setScale(0.5);

    // Frutas
    this.frutas = this.createGroup("kiwi", 9);

    // Verduras
    this.verduras = this.createGroup("durazno", 9);

    // Comida chatarra
    this.comidaChatarra = this.createGroup("Sandia", 4);

    // Posicionamiento aleatorio
    let randomArea = new Phaser.Geom.Rectangle(100, 100, 600, 300);
    Phaser.Actions.RandomRectangle(this.frutas.getChildren(), randomArea);
    Phaser.Actions.RandomRectangle(this.verduras.getChildren(), randomArea);
    Phaser.Actions.RandomRectangle(
      this.comidaChatarra.getChildren(),
      randomArea
    );

    // Puntuación y vidas
    this.puntuacion = 0;
    this.vidas = 5;
    this.textoPuntuacion = this.add
      .text(
        gameWidth / 2,
        50,
        `Puntuación: ${this.puntuacion} - Vidas: ${this.vidas}`,
        {
          fontSize: "32px",
          color: "#fff",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    // Controles
    this.cursors = this.input.keyboard.createCursorKeys();
    this.restartKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.R
    );

    // Movimiento de la cesta con el ratón
    this.input.on("pointermove", this.handlePointerMove, this);
  }

  update() {
    let speed = 10;
    if (
      this.cursors.left.isDown ||
      (this.input.activePointer.isDown && this.input.x < this.cesta.x)
    ) {
      this.cesta.x = Phaser.Math.Clamp(
        this.cesta.x - speed,
        0,
        this.sys.game.config.width
      );
    } else if (
      this.cursors.right.isDown ||
      (this.input.activePointer.isDown && this.input.x > this.cesta.x)
    ) {
      this.cesta.x = Phaser.Math.Clamp(
        this.cesta.x + speed,
        0,
        this.sys.game.config.width
      );
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
    this.textoPuntuacion.setFontSize("32px");
    this.textoPuntuacion.setPosition(this.sys.game.config.width / 2, 50);
    this.textoPuntuacion.setOrigin(0.5);

    if (this.vidas <= 0) {
      this.scene.start("GameOver");
    }
  }
}

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.CENTER_VERTICALLY,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { y: 200 },
    },
  },
  scene: [Menuprincipals, Game, GameOver],
};

let game = new Phaser.Game(config);
