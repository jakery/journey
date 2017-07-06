define('Player', ['./Sprite'], Sprite => function Player(spriteArguments) {
  Sprite.call(this, spriteArguments);
  this.imageType = 'image';
  this.image = spriteArguments.player;
  this.type = 'player';
  this.player = this;
  this.prototype = Object.create(Sprite.prototype);
  this.prototype.constructor = this;
  return this;
});
