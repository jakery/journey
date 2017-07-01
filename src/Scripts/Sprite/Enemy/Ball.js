const Enemy = require('../Enemy');

define('Ball', [], () => {
  function Ball(...args) {
    Enemy.call(this, ...args);

    this.updateMovementPattern = function updateMovementPattern() {
      // Go forward until hitting a wall and then turn around. Repeat.
      if (this.game.gameTimer % this.speedModulus === 0) {
        if (!this.canMove()) {
          this.turnAround();
        }
        this.goForward();
      }
      return null;
    };
  }

  // Inherit Enemy class.
  Ball.prototype = Object.create(Enemy.prototype);
  Ball.prototype.constructor = Ball;
  return Ball;
});
