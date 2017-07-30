const Sprite = require('../Sprite');
const RenderSettings = require('../../Constants/RenderSettings');
const Coordinates = require('../../Coordinates');
const Utility = require('../../Utility/Utility');

define('ItemAbstract', [], () => {
  function ItemAbstract(spriteArguments) {
    Sprite.call(this, spriteArguments);
    const itemData = spriteArguments.spriteData;
    this.spriteID = `item ${itemData.id}`;
    this.type = 'item';
    this.subType = itemData.subType;
    this.imageType = 'tile';
    this.position = new Coordinates(
      itemData.x / RenderSettings.baseUnit,
      (itemData.y - RenderSettings.baseUnit) / RenderSettings.baseUnit
    );
    this.linksTo = itemData.properties.linksTo;
    this.message = itemData.properties.Text;
    this.callback = itemData.properties.callback;
    this.destroyOnUse = itemData.properties.destroyOnUse === 'true';
    this.color = itemData.color;

    if (typeof (itemData.properties.destination) !== 'undefined') {
      this.destination = itemData.properties.destination;
    }

    this.checkCollision = function checkCollision() {
      if (Utility.areSpritesColliding(this.player, this)) {
        this.registerHit(this.player);
      } else {
        for (let j = 0; j < this.game.enemies.length; j += 1) {
          const enemy = this.game.enemies[j];
          if (Utility.areSpritesColliding(enemy, this)) {
            this.registerHit(enemy);
          }
        }
        for (let j = 0; j < this.game.tools.length; j += 1) {
          // Check if pushblocks collide with items (switches?).
          const tool = this.game.tools[j];

          if (Utility.areSpritesColliding(tool, this)) {
            // Enemy interacts with item.
            this.registerHit(tool);
          }
        }
      }
    };

    this.prototype = Object.create(Sprite.prototype);
    this.prototype.constructor = this;
  }
  return ItemAbstract;
});
