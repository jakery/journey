const Predator = require('./Predator');

define('SmartPredator', [], () => {
  function SmartPredator(...args) {
    Predator.call(this, ...args);

    this.deathMessages = [
      'DIE',
    ];
    this.updateMovementPattern = function updateMovementPattern() {
      if (this.game.gameTimer % this.speed) {
        return false;
      }
      this.movePredator();
      return null;
    };
    this.speed = 3;
  }

  // Inherit Predator class.
  SmartPredator.prototype = Object.create(Predator.prototype);
  SmartPredator.prototype.constructor = SmartPredator;
  return SmartPredator;
});
