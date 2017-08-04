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

    this.deathMessages = [
      'You got run over.',
      'Remember Iron Man 2, when Tony Stark and Whip Man fought on the Grand Prix track? This is the same thing, except you died.',
      'Legally you had the right of way. But you\'re still dead.',
      'Look both ways before playing in traffic.',
      'You got killed. Best race in years!',
      'The driver is traumatized. You\'re so selfish.',
      'Remember the car chase from The French Connection? This is the same thing, except you died.',
      'Great. Now the pizza won\'t be delivered in 30 minutes or less.',
      'One time when I was six I stepped in front of a moving car, just like this. Except I got out of the way.',
    ];
  }

  // Inherit EnemyAbstract class.
  Nascar.prototype = Object.create(EnemyAbstract.prototype);
  Nascar.prototype.constructor = Nascar;
  return Nascar;
});
