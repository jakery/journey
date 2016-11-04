
let Utility = require('../Scripts/Utility');
let Coordinates = require('../Scripts/Coordinates');
describe('Utility', () => {
  describe('tileDistanceBetween', function () {
    it('should return 1', function () {
      const sprite1 = new Coordinates(-1, -1);
      const sprite2 = new Coordinates(-2, -1);
      assert.equal(1, Utility.tileDistanceBetween(sprite1, sprite2));
    });
    it('should return 5', function () {
      const sprite1 = new Coordinates(10, 50);
      const sprite2 = new Coordinates(8, 47);
      assert.equal(5, Utility.tileDistanceBetween(sprite1, sprite2));
    });
  });
  describe('areColliding', function () {
    it('should return true', function () {
      const sprite1 = new Coordinates(5, 5);
      const sprite2 = new Coordinates(5, 5);
      assert.isTrue(Utility.areColliding(sprite1, sprite2));
    });
  });
});
