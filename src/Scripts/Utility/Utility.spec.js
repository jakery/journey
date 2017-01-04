/* eslint-disable prefer-arrow-callback */
const Utility = require('./Utility');
const Coordinates = require('../Coordinates');
const Sprite = require('../Sprite/Sprite');
const Dom = require('../Helpers/Dom');

describe('Utility', function UtilityTests() {
  describe('tileDistanceBetween', function tileDistanceBetween() {
    it('should return 1', function test() {
      const sprite1 = new Coordinates(-1, -1);
      const sprite2 = new Coordinates(-2, -1);
      assert.equal(Utility.tileDistanceBetween(sprite1, sprite2), 1);
    });
    it('should return 5', function test() {
      const sprite1 = new Coordinates(10, 50);
      const sprite2 = new Coordinates(8, 47);
      assert.equal(Utility.tileDistanceBetween(sprite1, sprite2), 5);
    });
    it.skip('should return NaN', function test() {
      const sprite1 = new Coordinates(10, 50);
      assert.equal(Utility.tileDistanceBetween(sprite1, {}), 5);
    });
  });
  describe('areColliding', function areColliding() {
    it('should return true', function test() {
      const coords1 = new Coordinates(5, 5);
      const coords2 = new Coordinates(5, 5);
      assert.isTrue(Utility.areColliding(coords1, coords2));
    });
    it('should return false', function test() {
      const coords1 = new Coordinates(10, 5);
      const coords2 = new Coordinates(5, 5);
      assert.isFalse(Utility.areColliding(coords1, coords2));
    });
  });
  describe('areSpritesColliding', function areSpritesColliding() {
    it('should return true', function test() {
      const sprite1 = new Sprite.Sprite({});
      sprite1.position = new Coordinates(5, 20);

      const sprite2 = new Sprite.Sprite({});
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
    it('should output to a Dom node.', function test() {
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

    it.skip('should trigger a popup message', function test() {
      // TODO: Create a spy for testing window alerts here.
    });
    it.skip('should create a message in the console', function test() {
      // TODO: Create a spy for testing console error messages.
    });
    it('should throw an error.', function test() {
      assert.throws(() => Utility.alert('theMessage', {}), Error, 'not properly configured');
    });
  });
});
