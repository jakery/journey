// TODO: Decouple
define('MessageBox', [], () => {
  function MessageBox(game, globalDraw) {
    this.game = game;
    this.globalDraw = globalDraw;
    this.backgroundColor = '';
    this.textColor = '';
    this.draw = function draw() {
      const ctx = this.globalDraw.ctx;
      ctx.save();
      ctx.fillStyle = this.backgroundColor;
      ctx.font = '12px sans-serif';
      ctx.fillRect(500, 160, 280, 200);
      ctx.fillStyle = this.textColor;
      this.globalDraw.drawWrappedText(this.game.messageText, 510, 170, 270, 18);
      ctx.restore();
    };
  }
  return MessageBox;
});
