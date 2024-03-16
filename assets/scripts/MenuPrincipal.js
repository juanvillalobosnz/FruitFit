class MenuPrincipal extends Phaser.Scene {
  constructor() {
    super({ key: "MenuPrincipal" });
  }

  create() {
    let centerX = this.cameras.main.centerX;
    let centerY = this.cameras.main.centerY;

    this.cameras.main.setBackgroundColor("#81BE81");

    // Título del juego
    let title = this.add
      .text(centerX, centerY - 200, "FruitFit", {
        fill: "#FFFFFF",
        fontSize: "80px",
        fontStyle: "bold",
        fontFamily: "Arco Font",
      })
      .setOrigin(0.5);

    // Animación del título
    this.tweens.add({
      targets: title,
      y: centerY - 180,
      duration: 2000,
      ease: "Power2",
      yoyo: true,
      loop: -1,
    });

    // Botón de jugar
    let jugarButton = this.add
      .text(centerX, centerY, "Jugar", {
        fill: "#FFFFFF",
        fontSize: "48px",
        backgroundColor: "#4CD31E",
        fontFamily: "Arco Font",
      })
      .setInteractive()
      .setPadding(20)
      .setOrigin(0.5);

    jugarButton.on("pointerdown", () => this.startGame());

    // Botón de opciones
    let opcionesButton = this.add
      .text(centerX, centerY + 100, "Opciones", {
        fill: "#FFFFFF",
        fontSize: "48px",
        backgroundColor: "#4CD31E",
        fontFamily: "Arco Font",
      })
      .setInteractive()
      .setPadding(20)
      .setOrigin(0.5);

    opcionesButton.on("pointerdown", () => this.openOptions());
  }

  startGame() {
    this.scene.start("Game");
  }

  openOptions() {
    this.scene.start("Options");
  }
}

export default MenuPrincipal;
