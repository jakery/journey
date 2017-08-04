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

    this.deathMessages = [
      'Remember when Indiana Jones got chased by that boulder? This is the same thing, except you died.',
      'Remember in Dodgeball when Vince Vaughn won the tournament? This is the same thing, except you died.',
      'Remember kickball on the playground? This is the same thing, except you died.',
      'Remember those giant gobstoppers you would eat as a kid? This is the same thing, except you died.',
      'Remember in The Sandlot when Smalls caught his first fly ball? This is the same thing, except you died.',
      'Remember in Cast Away where Tom Hanks was best friends with a volleyball? This is the same thing, except you died.',
    ];
  }

  // Inherit EnemyAbstract class.
  Ball.prototype = Object.create(EnemyAbstract.prototype);
  Ball.prototype.constructor = Ball;
  return Ball;
});
