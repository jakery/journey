const Sprite = require('./Sprite');
const RenderSettings = require('../Constants/RenderSettings');
const Coordinates = require('../Coordinates');

define('Item', [], () => {
  function Item(spriteArguments) {
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
    this.prototype = Object.create(Sprite.prototype);
    this.prototype.constructor = this;
  }
  return Item;
});
