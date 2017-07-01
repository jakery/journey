const Enemy = require('../Enemy');
const Constants = require('../../Constants/Constants');

define('Player2', [], () => {
  function Player2(...args) {
    Enemy.call(this, ...args);

    this.updateMovementPattern = function updateMovementPattern() {
      if (this.startCountup) {
        const tickDelay = 20;
        this.this.speedModulus = 4;
        this.ticks += 1;

        // 20-tick delay.
        if (this.ticks > tickDelay) {
          this.autoMove = true;
          if (!this.autoMove) {
            return false;
          }

          if (this.game.gameTimer % this.this.speedModulus) {
            return false;
          }

          this.turn(Constants.directions.right);
          this.goForward();
        }
      }
      // TODO: Refactor The End into its own class.
      // TODO: This is magic number hell. Figure out how to replace
      //   this with a proper custom-movement system.
      if (this.startTheEnd) {
        this.ticks += 1;

        if (this.position.y === 9 && this.position.x > 5) {
          this.game.player.rotation = 0;
          if (this.game.gameTimer % 40) {
            return false;
          }
          this.turn(Constants.directions.left);
          this.goForward();
        } else if (this.position.y === 9 && this.position.x > 4) {
          if (this.game.gameTimer % 200) {
            return false;
          }
          this.turn(Constants.directions.left);
          this.goForward();
        } else if (this.position.y === 9 && this.position.x > 3) {
          if (this.game.gameTimer % 100) {
            return false;
          }
          this.turn(Constants.directions.left);
          this.goForward();
        } else if (this.position.y > 6) {
          if (this.game.gameTimer % 40) {
            return false;
          }
          this.turn(Constants.directions.up);
          this.goForward();
        } else if (this.position.x < 4) {
          if (this.game.gameTimer % 40) {
            return false;
          }
          this.turn(Constants.directions.right);
          this.goForward();
        } else if (this.position.x < 5) {
          if (this.game.gameTimer % 100) {
            return false;
          }
          this.turn(Constants.directions.right);
          this.goForward();
          return false;
        } else {
          this.game.player.startCountup = true;
          return false;
        }
        return false;
      }
      return false;
    };
  }

  // Inherit Enemy class.
  Player2.prototype = Object.create(Enemy.prototype);
  Player2.prototype.constructor = Player2;
  return Player2;
});
