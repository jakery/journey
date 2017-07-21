const EnemyAbstract = require('./EnemyAbstract');

define('Nascar', [], () => {
  function Nascar(...args) {
    EnemyAbstract.call(this, ...args);

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

  // Inherit EnemyAbstract class.
  Nascar.prototype = Object.create(EnemyAbstract.prototype);
  Nascar.prototype.constructor = Nascar;
  return Nascar;
});
