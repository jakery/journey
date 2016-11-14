
let Utility = require('./Utility');
let Coordinates = require('../Coordinates');
let Sprite = require('../Sprite/Sprite');
describe('Utility', () => {

  // MATH
  describe('math', function () {
    describe('toRadians', function () {
      it('should convert degrees to radians.', function () {
        assert.equal(Utility.math.toRadians(180), Math.PI);
        assert.equal(Utility.math.toRadians(90), (Math.PI / 2));
        assert.equal(Utility.math.toRadians(45), (Math.PI / 4));
        assert.equal(Utility.math.toRadians(30), (Math.PI / 6));
        assert.equal(Utility.math.toRadians(2), (Math.PI / 90));
        assert.equal(Utility.math.toRadians(0), 0);
        assert.equal(Utility.math.toRadians(-90), (-Math.PI / 2));
        assert.equal(Utility.math.toRadians(-150), (-5 * Math.PI) / 6);
        assert.equal(Utility.math.toRadians(-180), -Math.PI);
      });
    });
    describe('toDegrees', function () {
      it('should convert radians to degrees.', function () {
        assert.equal(Utility.math.toDegrees(Math.PI), 180);
        assert.equal(Utility.math.toDegrees(Math.PI / 2), 90);
        assert.equal(Utility.math.toDegrees(0), 0);
        assert.equal(Utility.math.toDegrees(-Math.PI / 2), -90);
      });
    });
    describe('TAU', function () {
      it('should equal 2 * Math.PI', function () {
        assert.equal(Utility.math.TAU, Math.PI * 2);
      });
    });
  });
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
      const coords1 = new Coordinates(5, 5);
      const coords2 = new Coordinates(5, 5);
      assert.isTrue(Utility.areColliding(coords1, coords2));
    });
    it('should return false', function () {
      const coords1 = new Coordinates(10, 5);
      const coords2 = new Coordinates(5, 5);
      assert.isFalse(Utility.areColliding(coords1, coords2));
    });
  });
  describe('areSpritesColliding', function () {
    it('should return true', function () {
      const sprite1 = new Sprite.Sprite();
      sprite1.position = new Coordinates(5, 20);

      const sprite2 = new Sprite.Sprite();
      sprite2.position = new Coordinates(5, 20);
      assert.isTrue(Utility.areSpritesColliding(sprite1, sprite2));

    });
  });

  // POLYFILLS
  });

  describe('alert()', function () {
    it('should have complete tests.', function () {
      // TODO: Write these tests before touching Utility.js again.
    });
    it('should throw an error.', function () {
      assert.throws(() => Utility.alert('theMessage', {}), Error, 'not properly configured');
    });
  });

  // STRING
  describe('StringHelper', function () {
    describe('new', function () {
      it('should be a new StringHelper object.', function () {
        assert.equal(Utility.stringHelper.constructor.name, 'StringHelper');
      });
    });
  });
  // ARRAY
});
