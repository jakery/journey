const ItemAbstract = require('./ItemAbstract');

define('Switch', [], () => {
  const Switch = function Switch(...args) {
    ItemAbstract.call(this, ...args);


    this.corruptionSign = 1;
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

    this.draw = function drawSprite() {
      let tileNumber = this.tileGraphic;
      if (this.game.brownSwitch) {
        // Draw switch toggling.
        if (this.color === 'brown') {
          tileNumber -= 1;
        } else if (this.color === 'brownOff') {
          tileNumber += 1;
        }
      }
      this.globalDraw.drawTileOffset(tileNumber, this.position, this.corruptionSign);
    };
  };

  // Inherit Item class.
  Switch.prototype = Object.create(ItemAbstract.prototype);
  Switch.prototype.constructor = Switch;
  return Switch;
});
