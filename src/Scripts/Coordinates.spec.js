/* eslint-disable prefer-arrow-callback */
const Coordinates = require('../Scripts/Coordinates');

describe('CoordinatesTest', function CoordinatesTests() {
  it('should create coordinates.', function test() {
    const coordinates = new Coordinates(0, 0);
    assert.equal(0, coordinates.x);
    assert.equal(0, coordinates.y);
  });

  it('should have null X and Y properties.', function test() {
    const coordinates = new Coordinates(Infinity, NaN);
    assert.isNull(coordinates.x);
    assert.isNull(coordinates.y);
  });
});
