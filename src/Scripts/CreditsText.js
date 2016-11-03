define('CreditsText', [], () => (
  function CreditsText(text, color, font, alpha, speed, delay, y) {
    this.text = text || '';
    this.color = color || '';
    this.font = font || '';
    this.alpha = alpha || 0;
    this.speed = speed || 0;
    this.delay = (delay / 20) || 0;
    this.y = y || 0;

    this.alphaIncrement = (this.speed > 0)
      ? 5 / this.speed
      : 1;
  }
));
