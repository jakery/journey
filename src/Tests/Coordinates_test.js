let Coordinates = require('../Scripts/Coordinates');
describe('CoordinatesTest', function () {
  describe('Coordinates', function () {
    it('should create coordinates.', function () {
      let c = new Coordinates(0, 0);
      assert.equal(0, c.x);
      assert.equal(0, c.y);
    });

    it('should have null X and Y properties.', function () {
      let c = new Coordinates(Infinity, NaN);
      assert.isNull(c.x);
      assert.isNull(c.y);
    });
  });
});
