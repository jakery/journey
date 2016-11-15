/* eslint-disable prefer-arrow-callback */
const Constants = require('../Constants/Constants');
const Sprite = require('./Sprite');
// eslint-disable-next-line
const testMap = require('json!../Map/Mocks/testMap.json');

describe('Sprite', function SpriteTests() {
  let sprite;

  beforeEach(function beforeEach() {
    sprite = new Sprite.Sprite({
      map: {
        getTileByCoords: function getTileByCoords() {

        },
        getTileTypeByCoords: function getTileTypeByCoords() {

        },
      },
    });
    Object.assign(sprite.game.map, testMap);
  });
  describe('new', function newSprite() {
    it('should construct a new sprite', function test() {
      assert.equal(sprite.constructor.name, 'Sprite');
    });
  });

  describe('getRotation', function getRotation() {
    it('should return 0', function test() {
      sprite.direction = Constants.directions.up;
      assert.equal(sprite.getRotation(), 0);
    });

    it('should return 180', function test() {
      sprite.direction = Constants.directions.down;
      assert.equal(sprite.getRotation(), 180);
    });

    it('should return -90', function test() {
      sprite.direction = Constants.directions.left;
      assert.equal(sprite.getRotation(), -90);
    });

    it('should return 90', function test() {
      sprite.direction = Constants.directions.right;
      assert.equal(sprite.getRotation(), 90);
    });
  });
  describe('getTarget', function getTarget() {
    describe('up', function up() {
      it('should return the up coordinates', function test() {
        sprite.direction = Constants.directions.up;
        sprite.position = { x: 15, y: 15 };
        assert.deepEqual(sprite.getTarget(), { x: 15, y: 14 });
      });
      it('should return the wraparound up coordinates', function test() {
        sprite.direction = Constants.directions.up;
        sprite.position = { x: 15, y: 0 };
        assert.deepEqual(sprite.getTarget(), { x: 15, y: 19 });
      });
    });
    describe('down', function down() {
      it('should return the down coordinates', function test() {
        sprite.direction = Constants.directions.down;
        sprite.position = { x: 15, y: 15 };
        assert.deepEqual(sprite.getTarget(), { x: 15, y: 16 });
      });
      it('should return the wraparound down coordinates', function test() {
        sprite.direction = Constants.directions.down;
        sprite.position = { x: 15, y: 19 };
        assert.deepEqual(sprite.getTarget(), { x: 15, y: 0 });
      });
    });

    describe('left', function left() {
      it('should return the left coordinates', function test() {
        sprite.direction = Constants.directions.left;
        sprite.position = { x: 15, y: 15 };
        assert.deepEqual(sprite.getTarget(), { x: 14, y: 15 });
      });
      it('should return the wraparound left coordinates', function test() {
        sprite.direction = Constants.directions.left;
        sprite.position = { x: 0, y: 15 };
        assert.deepEqual(sprite.getTarget(), { x: 34, y: 15 });
      });
    });

    describe('right', function right() {
      it('should return the right coordinates', function test() {
        sprite.direction = Constants.directions.right;
        sprite.position = { x: 15, y: 15 };
        assert.deepEqual(sprite.getTarget(), { x: 16, y: 15 });
      });
      it('should return the wraparound right coordinates', function test() {
        sprite.direction = Constants.directions.right;
        sprite.position = { x: 34, y: 15 };
        assert.deepEqual(sprite.getTarget(), { x: 0, y: 15 });
      });
    });
  });
  // describe('canMove', function canMove() {
  //   it('should return true', function test() {
  //     assert.isTrue(sprite.canMove());
  //   });
  //   it('should return false', function test() {
  //     assert.isFalse(sprite.canMove());
  //   });
  // });
});


