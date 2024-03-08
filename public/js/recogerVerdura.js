export default function recogerVerdura(cesta, verdura) {
    this.puntuacion += 2;
    verdura.destroy();
    this.sound.play('sonidoRecogida');
    let newVerdura = this.verduras.create(Phaser.Math.Between(100, 700), 100, 'Sandia');
    newVerdura.setVelocityY(200);
    newVerdura.setScale(0.2);
    
    // Animación de salto
    this.tweens.add({
      targets: cesta,
      y: cesta.y - 50,
      duration: 100,
      yoyo: true,
    });
  }