// TODO: Decouple
define('PauseOverlay', [], () => {
  function PauseOverlay(stage, globalDraw) {
    this.globalDraw = globalDraw;
    this.settings = {
      border: {
        fillStyle: 'red',
        x: 20,
        y: 20,
        width: 274,
        height: 97,
      },
      background: {
        fillStyle: 'rgb(50,50,50)',
        x: 21,
        y: 21,
        width: 272,
        height: 95,
      },
      text: {
        value: 'PAUSED.\n\nPress P to resume.\nPress Enter to restart level.',
        x: 26,
        y: 26,
        maxWidth: 270,
        lineHeight: 22,
        font: '20px sans-serif',
        fillStyle: 'red',
      },
    };
    this.draw = function draw() {
      const ctx = this.globalDraw.ctx;
      ctx.save();

      // Draw shade over game.
      ctx.save();
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(
        stage.playboxX,
        stage.playboxY,
        stage.playboxWidth,
        stage.playboxHeight
      );
      ctx.restore();

      // Draw pause box.
      ctx.save();
      ctx.fillStyle = this.settings.border.fillStyle;
      ctx.fillRect(
        this.settings.border.x,
        this.settings.border.y,
        this.settings.border.width,
        this.settings.border.height
      );
      ctx.fillStyle = this.settings.background.fillStyle;
      ctx.fillRect(
        this.settings.background.x,
        this.settings.background.y,
        this.settings.background.width,
        this.settings.background.height
      );
      ctx.restore();

      // Draw pause text.
      ctx.save();
      ctx.fillStyle = this.settings.text.fillStyle;
      ctx.font = this.settings.text.font;
      this.globalDraw.drawWrappedText(
        this.settings.text.value,
        this.settings.text.x,
        this.settings.text.y,
        this.settings.text.maxWidth,
        this.settings.text.lineHeight
      );
      ctx.restore();

      ctx.restore();
    };
  }
  return PauseOverlay;
});
