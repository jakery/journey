// TODO: Move this to jaja.js
define('ArrayExtensions', [], () => function Array() {
  this.removeBySpriteId = function removeBySpriteId(array, id, safe) {
    if (typeof array === 'undefined') throw new Error('No array was provided.');
    return this.remove(array, this.findByProperty(array, 'spriteID', id, safe));
  };
});
