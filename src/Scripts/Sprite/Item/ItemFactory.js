const Key = require('./Key.js');
const ItemAbstract = require('./ItemAbstract.js');

define('ItemFactory', [], () => function ItemFactory(spriteArguments) {
  this.spriteArguments = spriteArguments;

  this.redKey = Key;
  this.yellowKey = Key;
  this.greenKey = Key;
  this.cyanKey = Key;

  this.createFrom = function createFrom(spriteData) {
    const theseArguments = Object.create(this.spriteArguments);
    theseArguments.spriteData = spriteData;
    const itemType = theseArguments.spriteData.subType;
    if (typeof this[itemType] !== 'undefined') {
      return new this[itemType](theseArguments);
    }
    return new ItemAbstract(theseArguments);
  };
});
