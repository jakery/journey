let Coordinates = require('../Scripts/Coordinates');
describe('CoordinatesTest', () => {
  describe('Coordinates', function () {
    it('should create coordinates.', function () {
      let c = new Coordinates(0, 0);
      assert.equal(0, c.x);
      assert.equal(0, c.y);
    });

    it('should have null X and Y properties.', function () {
      let c = new Coordinates(Infinity, NaN);
      assert.equal(null, c.x);
      assert.equal(null, c.y);
    });
  });
});
