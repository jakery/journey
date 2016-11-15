/* eslint-disable prefer-arrow-callback */
const TileCodes = require('./TileCodes');

describe('TileCodes', function TileCodesTests() {
  describe('new', function newTileCodes() {
    it('should be a TileCodes object', function test() {
      assert.equal(TileCodes.constructor.name, 'Object');
      assert.equal(TileCodes.nothing, 0);
    });
  });
});
