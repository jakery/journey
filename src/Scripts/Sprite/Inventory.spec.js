/* eslint-disable prefer-arrow-callback */
const Inventory = require('./Inventory');

describe('Inventory', function InventoryTests() {
  describe('new', function newInventory() {
    it('should create an inventory object', function test() {
      const inventory = new Inventory();
      assert.equal(inventory.constructor.name, 'Inventory');
      assert.equal(inventory.yellowKeys, 0);
    });
  });
});
