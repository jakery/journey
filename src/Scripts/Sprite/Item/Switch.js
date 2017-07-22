const ItemAbstract = require('./ItemAbstract');

define('Switch', [], () => {
  const Switch = function Switch(...args) {
    ItemAbstract.call(this, ...args);

    this.registerHit = function registerHit() {
      if (this.color === 'red') {
        this.game.redSwitch = true;
      }
      if (this.color === 'yellow') {
        this.game.yellowSwitch = true;
      }
      if (this.color === 'green') {
        this.game.greenSwitch = true;
      }
      if (this.color === 'brown' && !this.game.brownSwitch) {
        this.game.brownSwitch = true;
      }
      if (this.color === 'brownOff' && this.game.brownSwitch) {
        this.game.brownSwitch = false;
      }
    };
  };

  // Inherit Item class.
  Switch.prototype = Object.create(ItemAbstract.prototype);
  Switch.prototype.constructor = Switch;
  return Switch;
});
