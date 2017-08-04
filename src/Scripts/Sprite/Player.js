const Sprite = require('./Sprite');
const Utility = require('../Utility/Utility');
const DeathMessages = require('../Constants/DeathMessages');

define('Player', [], () => function Player(spriteArguments) {
  Sprite.call(this, spriteArguments);
  this.imageType = 'image';
  this.image = spriteArguments.player;
  this.type = 'player';
  this.crushCheck = function crushCheck() {
    if (!this.canMove(this.position)) {
      this.isDead = true;
      const message = Utility.array.getRandomElement(DeathMessages.crush);
      this.game.setDeadMessage(message);
    }
  };

  this.draw = function draw() {
    const ctx = this.globalDraw.ctx;
    if (!this.isAlive) {
      return false;
    }
    ctx.save();
    const offsetX = this.halfBaseUnit + this.stage.drawOffset.x;
    const offsetY = this.halfBaseUnit + this.stage.drawOffset.y;
    ctx.translate(
      (this.position.x * this.baseUnit) + offsetX,
      (this.position.y * this.baseUnit) + offsetY
    );
    ctx.rotate(Utility.math.toRadians(this.rotation));
    if (this.imageType === 'image') {
      ctx.drawImage(this.image, -this.halfBaseUnit, -this.halfBaseUnit);
    }
    ctx.restore();
    return false;
  };
  this.player = this;
  this.prototype = Object.create(Sprite.prototype);
  this.prototype.constructor = this;
  return this;
});
