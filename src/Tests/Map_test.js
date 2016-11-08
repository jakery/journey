let Map = require('../Scripts/Map');
describe('Map', function () {
  let map;
  beforeEach(function () {
    map = new Map({
      map: {
        width: 5,
        height: 5,
        layers: [
          {
            data: [
              50, 2, 2, 3, 5,
              5, 6, 2, 2, 10,
              2, 2, 2, 13, 14,
              15, 1, 1, 1, 1,
              1, 21, 22, 23, 2
            ]
          }
        ]
      }
    });
  });
  describe('getTileIndexByCoords()', function () {
    it('should return one dimensional index of coordinate.', function () {
      assert.equal(map.getTileIndexByCoords(0, 0), 0);
      assert.equal(map.getTileIndexByCoords(1, 0), 1);
      assert.equal(map.getTileIndexByCoords(2, 0), 2);
      assert.equal(map.getTileIndexByCoords(3, 0), 3);
      assert.equal(map.getTileIndexByCoords(0, 1), 5);
      assert.equal(map.getTileIndexByCoords(1, 1), 6);
      assert.equal(map.getTileIndexByCoords(4, 4), 24);
    });
  });

  describe('getTileTypeByCoords()', function () {
    it('should return value in data array corresponding to one-dimensional conversion.', function () {
      assert.equal(map.getTileTypeByCoords(2, 4), 22);
    });
  });

  describe('getCoordsByTileIndex()', function () {

    it('should return 2d coordinates converted from array index', function () {
      assert.deepEqual(map.getCoordsByTileIndex(0), { x: 0, y: 0 });
      assert.deepEqual(map.getCoordsByTileIndex(13), { x: 3, y: 2 });
      assert.deepEqual(map.getCoordsByTileIndex(24), { x: 4, y: 4 });
    });
  });

  describe('changeTileType()', function () {
    it('should have unit tests', function () {
      throw new Error('but it doesn\'t.');
    });
  });
  describe('isInBounds()', function () {
    it('should return true', function () {
      assert.isTrue(map.isInBounds({ x: map.width, y: map.height }));
      assert.isTrue(map.isInBounds({ x: 0, y: map.height - 1 }));
    });
    it('should return false', function () {
      assert.isFalse(map.isInBounds({ x: -1, y: map.height }));
      assert.isFalse(map.isInBounds({ x: map.width, y: -1 }));
      assert.isFalse(map.isInBounds({ x: map.width + 1, y: map.height }));
      assert.isFalse(map.isInBounds({ x: map.width, y: map.height }));
    });
  });
});
