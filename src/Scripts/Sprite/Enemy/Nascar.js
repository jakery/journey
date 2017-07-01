const Enemy = require('../Enemy');

define('Nascar', [], () => {
  function Nascar(...args) {
    Enemy.call(this, ...args);

    this.updateMovementPattern = function updateMovementPattern() {
      // Drive real fast and then TURN LEFT.
      if (this.game.gameTimer % this.speedModulus) {
        return false;
      }
      if (!this.canMove()) {
        this.turnAntiClockwise();
      }
      this.goForward();
      return null;
    };
  }

  // Inherit Enemy class.
  Nascar.prototype = Object.create(Enemy.prototype);
  Nascar.prototype.constructor = Nascar;
  return Nascar;
});
