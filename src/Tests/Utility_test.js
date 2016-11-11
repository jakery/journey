
let Utility = require('../Scripts/Utility/Utility');
let Coordinates = require('../Scripts/Coordinates');
describe('Utility', () => {
  describe('tileDistanceBetween', function () {
    it('should return 1', function () {
      const sprite1 = new Coordinates(-1, -1);
      const sprite2 = new Coordinates(-2, -1);
      assert.equal(Utility.tileDistanceBetween(sprite1, sprite2), 1);
    });
    it('should return 5', function () {
      const sprite1 = new Coordinates(10, 50);
      const sprite2 = new Coordinates(8, 47);
      assert.equal(Utility.tileDistanceBetween(sprite1, sprite2), 5);
    });
  });
  describe('areColliding', function () {
    it('should return true', function () {
      const sprite1 = new Coordinates(5, 5);
      const sprite2 = new Coordinates(5, 5);
      assert.isTrue(Utility.areColliding(sprite1, sprite2));
    });
  });
  describe('additional unit tests', function () {
    it('should have unit tests for every method.', function () {
      // TODO: Write these tests before touching Utility.js again.
    });
  });

  describe('alert()', function () {
    it('should have complete tests.', function () {
      // TODO: Write these tests before touching Utility.js again.
    });
    it('should throw an error.', function () {
      assert.throws(() => Utility.alert('theMessage', {}), Error, 'not properly configured');
    });
  });

  describe('StringHelper', function () {
    describe('new', function () {
      it('should be a new StringHelper object.', function () {
        assert.equal(Utility.string.constructor.name, 'StringHelper');
      });
    });
  });
});
