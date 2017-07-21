const EnemyAbstract = require('./EnemyAbstract');

define('BritishNascar', [], () => {
  function BritishNascar(...args) {
    EnemyAbstract.call(this, ...args);

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

  // Inherit EnemyAbstract class.
  BritishNascar.prototype = Object.create(EnemyAbstract.prototype);
  BritishNascar.prototype.constructor = BritishNascar;
  return BritishNascar;
});
