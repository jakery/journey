/* eslint-disable prefer-arrow-callback */
const Utility = require('../../src/Scripts/Utility/Utility');
const Coordinates = require('../../src/Scripts/Coordinates');
const Sprite = require('../../src/Scripts/Sprite/Sprite');
const Dom = require('../../src/Scripts/Helpers/Dom');

describe('Utility', function UtilityTests() {
  // MATH
  describe('math', function math() {
    describe('isNumeric', function isNumeric() {
      it('should return true', function test() {
        assert.isTrue(Utility.math.isNumeric(5));
        assert.isTrue(Utility.math.isNumeric(2.5));
        assert.isTrue(Utility.math.isNumeric(-100000));
        assert.isTrue(Utility.math.isNumeric(-3.1415));
        assert.isTrue(Utility.math.isNumeric(Math.PI));
        assert.isTrue(Utility.math.isNumeric('0'));
        assert.isTrue(Utility.math.isNumeric('0x01'));
      });
      it('should return false', function test() {
        assert.isFalse(Utility.math.isNumeric(Infinity));
        assert.isFalse(Utility.math.isNumeric(true));
        assert.isFalse(Utility.math.isNumeric(false));
        assert.isFalse(Utility.math.isNumeric(null));
        assert.isFalse(Utility.math.isNumeric(undefined));
        assert.isFalse(Utility.math.isNumeric({}));
        assert.isFalse(Utility.math.isNumeric(''));
        assert.isFalse(Utility.math.isNumeric('fred'));
        assert.isFalse(Utility.math.isNumeric('0a'));
      });
    });
    describe('toRadians', function toRadians() {
      it('should convert degrees to radians.', function test() {
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
      it('should convert radians to degrees.', function test() {
        assert.equal(Utility.math.toDegrees(Math.PI), 180);
        assert.equal(Utility.math.toDegrees(Math.PI / 2), 90);
        assert.equal(Utility.math.toDegrees(0), 0);
        assert.equal(Utility.math.toDegrees(-Math.PI / 2), -90);
      });
    });
    describe('TAU', function TAU() {
      it('should equal 2 * Math.PI', function test() {
        assert.equal(Utility.math.TAU, Math.PI * 2);
      });
    });
  });
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

  // ARRAY
  describe('ArrayHelper', function ArrayHelper() {
    describe('sum', function sum() {
      it('should return the sum of the numbers in the array', function test() {
        assert.equal(Utility.array.sum([1, 2, 3, 4, 5]), 15);
      });
    });

    describe('getAllIndexes', function getAllIndexes() {
      it('should return all the indexes of the number 2', function test() {
        const myArray = [0, 2, 0, 0, 2, 2, 5, 48, 1, 2, 4, 6, 34, 5, 3, 2];
        const indexesOfNumber2 = Utility.array.getAllIndexes(myArray, 2);
        assert.deepEqual(indexesOfNumber2, [1, 4, 5, 9, 15]);
      });
      it('should return empty array', function test() {
        const myArray = [0, 1, 2, 5, 12, 500];
        const indexesOfNumber2 = Utility.array.getAllIndexes(myArray, 46);
        assert.equal(indexesOfNumber2.length, 0);
      });
    });

    describe('findByProperty', function findByProperty() {
      it('should return the first object containing a "name" property with the value "foo"', function test() {
        const myArray = [0, 2, 0, { name: 'bar' }, 2, 5, 65, 48, 8, 9, { name: 'foo', info: 'bat' }, 11, 12, { name: 'foo', info: 'snafu' }, 3, 2];
        const myFooObject = Utility.array.findByProperty(myArray, 'name', 'foo', true);
        assert.deepEqual(myFooObject, { name: 'foo', info: 'bat' });
      });

      it('should throw an error', function test() {
        const myArray = [0, 2, 0, { name: 'bar' }];
        assert.throws(
          () => { Utility.array.findByProperty(myArray, 'name', 'uhoh', false); },
          Error,
          'Couldn\'t find object with property'
        );
      });

      it('should NOT throw an error. Should return null', function test() {
        const myArray = [0, 2, 0, { name: 'bar' }];
        const myUhohObject = Utility.array.findByProperty(myArray, 'name', 'uhoh', true);
        assert.isNull(myUhohObject);
      });
    });
    describe('findAllByProperty', function findAllByProperty() {
      it('should return an array of all objects containing a "name" property with the value "foo"', function test() {
        const myArray = [0, 2, 0, { name: 'bar' }, 9, { name: 'foo', info: 'bat' }, 11, 12, { name: 'foo', info: 'snafu' }, 3, 2];
        const myFooArray = Utility.array.findAllByProperty(myArray, 'name', 'foo', true);
        assert.deepEqual(myFooArray, [{ name: 'foo', info: 'bat' }, { name: 'foo', info: 'snafu' }]);
      });
    });

    describe('remove', function remove() {
      it('should remove all instances of the number 5 from the array', function test() {
        const myArray = [1, 2, 3, 4, 5, 5, 5, 6, 10, 'foo', '5', 4];
        Utility.array.remove(myArray, 5);
        assert.deepEqual(myArray, [1, 2, 3, 4, 6, 10, 'foo', '5', 4]);
      });

      it('should remove all instances of variables from the array', function test() {
        const myArray = [1, 2, true, 4, 5, '12', 10, 'foo', '5', 4, true, 'foo'];
        Utility.array.remove(myArray, '5', 'foo', true);
        assert.deepEqual(myArray, [1, 2, 4, 5, '12', 10, 4]);
      });

      it('should remove nothing from the array', function test() {
        const myArray = [1, 2, true, 4, 5, '12', 10, 'foo', '5', 4, true, 'foo'];
        Utility.array.remove(myArray, 1000);
        assert.deepEqual(myArray, [1, 2, true, 4, 5, '12', 10, 'foo', '5', 4, true, 'foo']);
      });

      // TODO: Make this test pass. Requires rewrite of Utility.array.remove.
      it.skip('should remove objects from the array', function test() {
        const myArray = [1, 2, { number: 3 }];
        Utility.array.remove(myArray, { number: 3 });
        assert.deepEqual(myArray, [1, 2]);
      });
    });
  });
});
