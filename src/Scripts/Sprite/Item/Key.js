const ItemAbstract = require('./ItemAbstract');
const Utility = require('../../Utility/Utility');

define('Key', [], () => {
  const Key = function Key(...args) {
    ItemAbstract.call(this, ...args);

    this.registerHit = function registerHit(s) {
      const sprite = s;

      if (this.subType === 'yellowKey') {
        // If player or predator enemy, can pick up key.
        if (sprite.type === 'player' || sprite.subType === 'predator' || sprite.subType === 'smartPredator') {
          // Player gains key.
          sprite.inventory.yellowKeys += 1;

          // Remove key from map.
          Utility.array.removeBySpriteId(this.game.items, this.spriteID);
        }
      }

      if (this.subType === 'redKey') {
        // If player or predator enemy, can pick up key.
        if (sprite.type === 'player' || sprite.subType === 'predator' || sprite.subType === 'smartPredator') {
          // Player gains key.
          sprite.inventory.redKeys += 1;

          // Remove key from map.
          Utility.array.removeBySpriteId(this.game.items, this.spriteID);
        }
      }

      if (this.subType === 'cyanKey') {
        // If player or predator enemy, can pick up key.
        if (sprite.type === 'player' || sprite.subType === 'predator' || sprite.subType === 'smartPredator') {
          // Player gains key.
          sprite.inventory.cyanKeys += 1;

          // Remove key from map.
          Utility.array.removeBySpriteId(this.game.items, this.spriteID);
        }
      }

      if (this.subType === 'greenKey') {
        // If player or predator enemy, can pick up key.
        if (sprite.type === 'player' || sprite.subType === 'predator' || sprite.subType === 'smartPredator') {
          // Player gains key.
          sprite.inventory.greenKeys += 1;

          // Remove key from map.
          Utility.array.removeBySpriteId(this.game.items, this.spriteID);
        }
      }
    };
  };

  // Inherit Item class.
  Key.prototype = Object.create(ItemAbstract.prototype);
  Key.prototype.constructor = Key;
  return Key;
});
