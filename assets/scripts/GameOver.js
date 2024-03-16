class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: "GameOver" });
  }

  create() {
    this.cameras.main.setBackgroundColor("#81BE81"); // Aquí puedes poner el color que quieras
    let gameOverText = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2,
        "¡Se te acabaron las vidas!",
        {
          fontSize: "68px",
          color: "#FF0000",
          fontFamily: "Arco Font",
        }
      )
      .setOrigin(0.5);

    let restartButton = this.add
      .text(
        this.sys.game.config.width / 2,
        this.sys.game.config.height / 2 + 100,
        "Reiniciar",
        {
          fontSize: "42px",
          fill: "#FFFFFF",
          backgroundColor: "#4CD31E",
          fontFamily: "Arco Font",
          padding: { left: 10, right: 10, top: 10, bottom: 10 },
        }
      )
      .setOrigin(0.5)
      .setInteractive();

    restartButton.on("pointerdown", () => {
      this.scene.stop();
      this.scene.start("Game");
    });
  }
}

export default GameOver;
