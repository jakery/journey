const EnemyAbstract = require('./EnemyAbstract');
const Constants = require('../../Constants/Constants');

define('Predator', [], () => {
  function Predator(...args) {
    EnemyAbstract.call(this, ...args);

    this.deathMessages = [
      'You made a friend.',
      'He\'s your number one fan.', 'I think he likes you.',
      'Compasses point north. His heart points to you.',
      'He has free candy in his windowless van.',
    ];

    this.updateMovementPattern = function updateMovementPattern() {
      if (this.game.gameTimer % this.speedModulus) {
        return false;
      }
      this.movePredator();
      return null;
    };

    this.movePredator = function movePredator() {
      // Try to close distance to player by means of an absolute direct path,
      // regardless of obstacles.
      const xDist = Math.abs(this.position.x - this.game.player.position.x);
      const yDist = Math.abs(this.position.y - this.game.player.position.y);

      if (xDist > yDist) {
        if (this.position.x > this.game.player.position.x) {
          this.turn(Constants.directions.left);
        } else {
          this.turn(Constants.directions.right);
        }
        if (!this.canMove()) {
          if (this.position.y > this.game.player.position.y) {
            this.turn(Constants.directions.up);
          } else if (this.position.y < this.game.player.position.y) {
            this.turn(Constants.directions.down);
          }
        }
      } else {
        if (this.position.y > this.game.player.position.y) {
          this.turn(Constants.directions.up);
        } else {
          this.turn(Constants.directions.down);
        }
        if (!this.canMove()) {
          if (this.position.x > this.game.player.position.x) {
            this.turn(Constants.directions.left);
          } else if (this.position.x < this.game.player.position.x) {
            this.turn(Constants.directions.right);
          }
        }
      }
      this.goForward();
    };
  }

  // Inherit EnemyAbstract class.
  Predator.prototype = Object.create(EnemyAbstract.prototype);
  Predator.prototype.constructor = Predator;
  return Predator;
});
