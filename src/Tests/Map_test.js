let Map = require('../Scripts/Map');
describe('Map', function () {
  let map;
  beforeEach(function () {
    map = new Map({
      map: {
        width: 96,
        height: 96
      }
    });
  });
  describe('getTileIndexByCoords()', function () {
    it('should have unit tests', function () {
      throw new Error('but it doesn\'t.');
    });
  });

  describe('getTileTypeByCoords()', function () {
    it('should have unit tests', function () {
      throw new Error('but it doesn\'t.');
    });
  });

  describe('getCoordsByTileIndex()', function () {
    it('should have unit tests', function () {
      throw new Error('but it doesn\'t.');
    });
  });

    describe('changeTileType()', function () {
    it('should have unit tests', function () {
      throw new Error('but it doesn\'t.');
    });
  });
  describe('isInBounds()', function () {
    it('should return true', function () {
      assert.isTrue(map.isInBounds({ x: 32, y: 32 }));
      assert.isTrue(map.isInBounds({ x: 0, y: 95 }));
    });
    it('should return false', function () {
      assert.isFalse(map.isInBounds({ x: -1, y: 32 }));
      assert.isFalse(map.isInBounds({ x: 32, y: -1 }));
      assert.isFalse(map.isInBounds({ x: 97, y: 32 }));
      assert.isFalse(map.isInBounds({ x: 32, y: 97 }));
    });
  });
});
