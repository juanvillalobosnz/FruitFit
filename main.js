import Phaser from "phaser";
import { recursos } from "@assets/scripts/recursos";
import Menuprincipals from "@assets/scripts/MenuPrincipal";
import GameOver from "@assets/scripts/GameOver";

class Game extends Phaser.Scene {
  constructor() {
    super({ key: "Game" });
    this.cursors = null;
    this.restartKey = null;
  }

  crearObjetos(grupo, key, cantidad) {
    for (let i = 0; i < cantidad; i++) {
        const objeto = grupo.create(Phaser.Math.Between(0, this.sys.game.config.width), 100, key);
        objeto.setVelocityY(200);
        objeto.setScale(0.07);
    }
  }

  preload() {
    this.loadAssets();
  }

  create() {
    this.createGameElements();
    this.createControls();
  }

  loadAssets() {
    // Cargar imágenes de fondo y cesta
    this.load.image("fondo", recursos.imagenes.fondo);
    this.load.image("cesta", recursos.imagenes.cesta);

    // Cargar imágenes de frutas
    for (const [key, path] of Object.entries(recursos.imagenes.frutas)) {
      this.load.image(key, path);
    }

    // Cargar imágenes de verduras
    for (const [key, path] of Object.entries(recursos.imagenes.verduras)) {
      this.load.image(key, path);
    }

    // Cargar imágenes de comida chatarra
    for (const [key, path] of Object.entries(
      recursos.imagenes.comidaChatarra
    )) {
      this.load.image(key, path);
    }

    // Cargar audio
    this.load.audio("sonidoRecogida", recursos.audio.sonidoRecogida);
    this.load.audio("sonidoDaño", recursos.audio.sonidoDaño);
  }

  createGameElements() {
    this.createBackground();
    this.createBasket();
    this.createCollectibles();
    this.createScoreAndLives();
  }

  createBackground() {
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;
    const background = this.add.image(0, 0, "fondo").setOrigin(0, 0);
    const scaleFactor = Math.max(
      gameWidth / background.width,
      gameHeight / background.height
    );
    background.setScale(scaleFactor);
  }

  createBasket() {
    this.basket = this.physics.add
      .image(400, 500, "cesta")
      .setCollideWorldBounds(true)
      .setScale(0.5);
  }

  createCollectibles() {
    this.frutas = this.physics.add.group();
    this.verduras = this.physics.add.group();
    this.comidaChatarra = this.physics.add.group();

    // Crear frutas
    for (const key of Object.keys(recursos.imagenes.frutas)) {
      this.crearObjetos(this.frutas, key, 9);
    }

    // Crear verduras
    for (const key of Object.keys(recursos.imagenes.verduras)) {
      this.crearObjetos(this.verduras, key, 9);
    }

    // Crear comida chatarra
    for (const key of Object.keys(recursos.imagenes.comidaChatarra)) {
      this.crearObjetos(this.comidaChatarra, key, 8);
    }
  }

  createGroup(groupName, key, repeat) {
    this[groupName] = this.physics.add.group({
      key: key,
      repeat: repeat,
      setXY: { x: 12, y: 0, stepX: 70 },
    });
    const randomArea = new Phaser.Geom.Rectangle(100, 100, 600, 300);
    Phaser.Actions.RandomRectangle(this[groupName].getChildren(), randomArea);
  }

  createScoreAndLives() {
    this.score = 0;
    this.lives = 5;
    this.scoreText = this.add
      .text(
        this.sys.game.config.width / 2,
        50,
        `Score: ${this.score} - Lives: ${this.lives}`,
        {
          fontSize: "32px",
          color: "#fff",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);
  }

  createControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.restartKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.R
    );
    this.input.on("pointermove", this.handlePointerMove, this);
  }

  handlePointerMove(pointer) {
    this.basket.x = Phaser.Math.Clamp(pointer.x, 0, this.sys.game.config.width);
  }

  update() {
    this.updateBasketPosition();
    this.checkCollisions();
    this.updateScoreAndLives();
    this.checkGameOver();
  }

  updateBasketPosition() {
    const speed = 10;
    const isMovingLeft =
      this.cursors.left.isDown ||
      (this.input.activePointer.isDown && this.input.x < this.basket.x);
    const isMovingRight =
      this.cursors.right.isDown ||
      (this.input.activePointer.isDown && this.input.x > this.basket.x);

    if (isMovingLeft) {
      this.basket.x = Phaser.Math.Clamp(
        this.basket.x - speed,
        0,
        this.sys.game.config.width
      );
    } else if (isMovingRight) {
      this.basket.x = Phaser.Math.Clamp(
        this.basket.x + speed,
        0,
        this.sys.game.config.width
      );
    }
  }

  checkCollisions() {
    // Colisiones para frutas
    for (const key of Object.keys(recursos.imagenes.frutas)) {
      this.physics.add.overlap(
        this.basket,
        this.frutas.getChildren().filter((child) => child.texture.key === key),
        this.recogerFruta,
        null,
        this
      );
    }

    // Colisiones para verduras
    for (const key of Object.keys(recursos.imagenes.verduras)) {
      this.physics.add.overlap(
        this.basket,
        this.verduras
          .getChildren()
          .filter((child) => child.texture.key === key),
        this.recogerVerdura,
        null,
        this
      );
    }

    // Colisiones para comida chatarra
    for (const key of Object.keys(recursos.imagenes.comidaChatarra)) {
      this.physics.add.overlap(
        this.basket,
        this.comidaChatarra
          .getChildren()
          .filter((child) => child.texture.key === key),
        this.perderVida,
        null,
        this
      );
    }
  }

  updateScoreAndLives() {
    this.scoreText.setText(`Score: ${this.score} - Lives: ${this.lives}`);
    this.scoreText.setFontSize("32px");
    this.scoreText.setPosition(this.sys.game.config.width / 2, 50);
    this.scoreText.setOrigin(0.5);
  }

  checkGameOver() {
    if (this.lives <= 0) {
      this.scene.start("GameOver");
    }
  }
  recogerVerdura(cesta, verdura) {
    this.score += 2; // Cambia 'puntuacion' a 'score'
    verdura.destroy();
    this.sound.play("sonidoRecogida");

    if (this.verduras) {
      let newVerdura = this.verduras.create(
        Phaser.Math.Between(0, this.sys.game.config.width),
        100,
        "piza"
      );
      newVerdura.setVelocityY(200);
      newVerdura.setScale(0.2);
    }

    // Animación de salto
    this.tweens.add({
      targets: cesta,
      y: cesta.y - 50,
      duration: 100,
      yoyo: true,
    });
  }

  recogerFruta(cesta, fruta) {
    this.score++; // Cambia 'puntuacion' a 'score'
    fruta.destroy();
    this.sound.play("sonidoRecogida");
    if (this.verduras) {
      let newFruta = this.frutas.create(
        Phaser.Math.Between(0, this.sys.game.config.width),
        100,
        "kiwi"
      );
      newFruta.setVelocityY(200);
      newFruta.setScale(0.2);
    }
    // Animación de salto
    this.tweens.add({
      targets: cesta,
      y: cesta.y - 50,
      duration: 100,
      yoyo: true,
    });
  }

  perderVida(_, comidaChatarra) {
    this.lives--;
    comidaChatarra.destroy();
    this.sound.play("sonidoDaño");
    this.cameras.main.shake(200, 0.05);
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
