export default function perderVida(cesta, comidaChatarra) {
    this.vidas--;
    comidaChatarra.destroy();
    this.sound.play('sonidoDaño');
    this.cameras.main.shake(200, 0.05);
  }
  