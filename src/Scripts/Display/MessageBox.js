// TODO: Decouple
define('MessageBox', [], () => {
  function MessageBox(game, globalDraw) {
    this.x = 500;
    this.y = 160;
    this.width = 280;
    this.height = 200;
    this.textMargin = 10;
    this.lineHeight = 18;
    this.font = '12px sans-serif';

    this.game = game;
    this.globalDraw = globalDraw;
    this.backgroundColor = '';
    this.textColor = '';

    this.textX = this.x + this.textMargin;
    this.textY = this.y + this.textMargin;
    this.textWrapLength = this.width - this.textMargin;

    this.draw = function draw() {
      const ctx = this.globalDraw.ctx;
      ctx.save();
      ctx.fillStyle = this.backgroundColor;
      ctx.font = this.font;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      ctx.fillStyle = this.textColor;
      this.globalDraw.drawWrappedText(this.game.messageText, this.textX, this.textY, this.textWrapLength, this.lineHeight);
      ctx.restore();
    };
  }
  return MessageBox;
});
