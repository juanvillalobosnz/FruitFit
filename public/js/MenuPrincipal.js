class MenuPrincipal extends Phaser.Scene {
  constructor() {
    super({ key: "MenuPrincipal" });
  }

  create() {
    let centerX = this.cameras.main.centerX;
    let centerY = this.cameras.main.centerY;

    // Fondo del menú
    this.add.rectangle(centerX, centerY, this.cameras.main.width, this.cameras.main.height, 0x1d1d1d);

    // Título del juego
    this.add.text(centerX, centerY - 100, "FruitFit", { fill: "#FFFFFF", fontSize: '60px',  fontStyle: 'bold', fontFamily: 'Arco Font'}).setOrigin(0.5);

    // Botón de jugar
    let jugarButton = this.add.text(centerX, centerY, "Jugar", { fill: "#FFFFFF", fontSize: '32px', backgroundColor: '#0000FF', fontFamily: 'Arco Font' })
      .setInteractive()
      .setPadding(10)
      .setOrigin(0.5);

    jugarButton.on("pointerdown", () => this.startGame());

    // Botón de opciones
    let opcionesButton = this.add.text(centerX, centerY + 100, "Opciones", { fill: "#FFFFFF", fontSize: '32px', backgroundColor: '#0000FF', fontFamily: 'Arco Font' })
      .setInteractive()
      .setPadding(10)
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
  