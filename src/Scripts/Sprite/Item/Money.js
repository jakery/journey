const ItemAbstract = require('./ItemAbstract');

define('Money', [], () => {
  const Money = function Money(...args) {
    ItemAbstract.call(this, ...args);

    this.registerHit = function registerHit(s) {
      const sprite = s;

      if (sprite.type === 'player') {
        // Player gains money.
        sprite.inventory.money += 1;
        this.destroy();
      }
    };
  };

  // Inherit Item class.
  Money.prototype = Object.create(ItemAbstract.prototype);
  Money.prototype.constructor = Money;
  return Money;
});
