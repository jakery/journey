define('SpriteArguments', [], () => {
  const SpriteArguments = function SpriteArguments(game, stage, keyboard, globalDraw, pwh, player, spriteData) {
    this.game = game || null;
    this.stage = stage || null;
    this.keyboard = keyboard || null;
    this.globalDraw = globalDraw || null;
    this.pwh = pwh || null;
    this.player = player || null;
    this.spriteData = spriteData || null;
  };
  return SpriteArguments;
});
