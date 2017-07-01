const Enemy = require('../Enemy');

define('BritishNascar', [], () => {
  function BritishNascar(...args) {
    Enemy.call(this, ...args);

    this.updateMovementPattern = function updateMovementPattern() {
      // Drive real fast and then TURN RIGHT.
      if (this.game.gameTimer % this.speedModulus) {
        return false;
      }
      if (!this.canMove()) {
        this.turnProClockwise();
      }
      this.goForward();
      return null;
    };
  }

  // Inherit Enemy class.
  BritishNascar.prototype = Object.create(Enemy.prototype);
  BritishNascar.prototype.constructor = BritishNascar;
  return BritishNascar;
});
