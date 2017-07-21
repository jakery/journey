const EnemyAbstract = require('./EnemyAbstract');

define('Ball', [], () => {
  function Ball(...args) {
    EnemyAbstract.call(this, ...args);

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

  // Inherit EnemyAbstract class.
  Ball.prototype = Object.create(EnemyAbstract.prototype);
  Ball.prototype.constructor = Ball;
  return Ball;
});
