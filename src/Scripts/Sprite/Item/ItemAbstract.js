const Sprite = require('../Sprite');
const RenderSettings = require('../../Constants/RenderSettings');
const Coordinates = require('../../Coordinates');

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

    if (typeof (itemData.properties.destination) !== 'undefined') {
      this.destination = itemData.properties.destination;
    }
    this.prototype = Object.create(Sprite.prototype);
    this.prototype.constructor = this;
  }
  return ItemAbstract;
});
