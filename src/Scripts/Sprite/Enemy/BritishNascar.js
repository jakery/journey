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

    this.deathMessages = [
      'Kate Middleton, forgive us.',
      'Into the boot with you, lad.',
      'You\'ve wrecked me bonnet.',
      'Oi, out of the roundabout!',
      'You properly bodged that up.',
      'Typical chav, muckin\' about in the road.', 'The driver spilled his cuppa on his kit.',
      'You\'ll be needin\' elastoplast, yobbo.', 'You\'re a right git.', 'What are you, the bleedin\' lollipop man?', 'Remember when the offie worked on spiv\'s mumpty\'s carbage to barter for scrumpies, and the plod pulled him out right as the shoes went banger? This is the same thing, except you\'re brown bread.',
    ]
  }

  // Inherit EnemyAbstract class.
  BritishNascar.prototype = Object.create(EnemyAbstract.prototype);
  BritishNascar.prototype.constructor = BritishNascar;
  return BritishNascar;
});
