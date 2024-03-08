export default function recogerFruta(cesta, fruta) {
    this.puntuacion++;
    fruta.destroy();
    this.sound.play('sonidoRecogida');
    let newFruta = this.frutas.create(Phaser.Math.Between(100, 700), 100, 'kiwi');
    newFruta.setVelocityY(200);
    newFruta.setScale(0.2);
    
    // Animación de salto
    this.tweens.add({
      targets: cesta,
      y: cesta.y - 50,
      duration: 100,
      yoyo: true,
    });
  }