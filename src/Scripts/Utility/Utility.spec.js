/* eslint-disable prefer-arrow-callback */
const Utility = require('./Utility');
const Coordinates = require('../Coordinates');
const Sprite = require('../Sprite/Sprite');
const Dom = require('../Helpers/Dom');

describe('Utility', function UtilityTests() {
  // MATH
  describe('math', function math() {
    describe('toRadians', function toRadians() {
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
    describe('toDegrees', function toDegrees() {
      it('should convert radians to degrees.', function () {
        assert.equal(Utility.math.toDegrees(Math.PI), 180);
        assert.equal(Utility.math.toDegrees(Math.PI / 2), 90);
        assert.equal(Utility.math.toDegrees(0), 0);
        assert.equal(Utility.math.toDegrees(-Math.PI / 2), -90);
      });
    });
    describe('TAU', function TAU() {
      it('should equal 2 * Math.PI', function () {
        assert.equal(Utility.math.TAU, Math.PI * 2);
      });
    });
  });
  describe('tileDistanceBetween', function tileDistanceBetween() {
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
  describe('areColliding', function areColliding() {
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
  describe('areSpritesColliding', function areSpritesColliding() {
    it('should return true', function () {
      const sprite1 = new Sprite.Sprite();
      sprite1.position = new Coordinates(5, 20);

      const sprite2 = new Sprite.Sprite();
      sprite2.position = new Coordinates(5, 20);
      assert.isTrue(Utility.areSpritesColliding(sprite1, sprite2));
    });
  });

  // POLYFILLS
  describe('console', function console() {
    assert.isDefined(Utility.console);
    assert.isFunction(Utility.console.assert);
  });

  describe('alert()', function alert() {
    it('should output to a Dom node.', function () {
      const myErrorDiv = document.createElement('div');
      myErrorDiv.innerHTML = 'old HTML';
      myErrorDiv.id = 'error';
      document.body.appendChild(myErrorDiv);
      myErrorDiv.style.backgroundColor = 'red';
      myErrorDiv.style.color = 'white';
      myErrorDiv.style.display = 'inline';
      myErrorDiv.style.visibility = 'hidden';
      const outputDomNode = new Dom(document.getElementById('error'));
      Utility.alert('Error Message!', outputDomNode);

      assert.equal(document.getElementById('error').style.visibility, 'visible');
      assert.equal(document.getElementById('error').innerHTML, 'Error Message!');
    });

    it('should trigger a popup message', function () {
      // TODO: Create a spy for testing window alerts here.
    });
    it('should create a message in the console', function () {
      // TODO: Create a spy for testing console error messages.
    });
    it('should throw an error.', function () {
      assert.throws(() => Utility.alert('theMessage', {}), Error, 'not properly configured');
    });
  });

  // STRING
  describe('StringHelper', function StringHelper() {
    describe('new', function newStringHelper() {
      it('should be a new StringHelper object.', function () {
        assert.equal(Utility.stringHelper.constructor.name, 'StringHelper');
      });
    });
  });

  // ARRAY
  describe('ArrayHelper', function ArrayHelper() {
    describe('new', function newArrayHelper() {
      it('should be a new ArrayHelper object.', function () {
        assert.equal(Utility.array.constructor.name, 'Array');
      });
    });
  });
});
