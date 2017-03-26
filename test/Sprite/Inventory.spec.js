/* eslint-disable prefer-arrow-callback */
const Inventory = require('./Inventory');

describe('Inventory', function InventoryTests() {
  describe('new', function newInventory() {
    it('should create an inventory object', function test() {
      assert.equal(Inventory.constructor.name, 'Object');
      assert.equal(Inventory.yellowKeys, 0);
    });
  });
});
