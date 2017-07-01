const Enemy = require('../Enemy');

define('Gronpree', [], () => {
  function Gronpree(...args) {
    Enemy.call(this, ...args);

    this.updateMovementPattern = function updateMovementPattern() {
      /*
        Move forward until hit obstacle.

        In event of obstacle:
        Try turning clockwise, then counter clockwise, then going in reverse.

        In event of next obstacle:
        Try turning counterclockwise, then clockwise, then going in reverse.

        Switch back and forth between counterclockwise
          and clockwise preference on every obstacle encountered.
      */
      if (this.game.gameTimer % this.speedModulus) {
        return false;
      }

      if (!this.canMove()) {
        if (!this.isPreferringClockwise) {
          this.turnAntiClockwise();
          if (!this.canMove()) {
            this.turnAround();
            if (!this.canMove()) {
              this.turnProClockwise();
            }
          } else {
            this.isPreferringClockwise = this.isPreferringClockwise.toggle();
          }
        } else {
          this.turnProClockwise();
          if (!this.canMove()) {
            this.turnAround();
            if (!this.canMove()) {
              this.turnAntiClockwise();
            }
          } else {
            this.isPreferringClockwise = this.isPreferringClockwise.toggle();
          }
        }
      }

      this.goForward();
      return null;
    };
  }

  // Inherit Enemy class.
  Gronpree.prototype = Object.create(Enemy.prototype);
  Gronpree.prototype.constructor = Gronpree;
  return Gronpree;
});
