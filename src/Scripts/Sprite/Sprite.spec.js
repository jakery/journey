/* eslint-disable prefer-arrow-callback */
const Orientation = require('./Orientation');
const Sprite = require('./Sprite');
const Map = require('../Map/Map');
// eslint-disable-next-line
const testMap = require('json!../Map/Mocks/testMap.json');

describe('Sprite', function SpriteTests() {
  let sprite;

  beforeEach(function beforeEach() {
    sprite = new Sprite.Sprite({
      map: new Map(testMap),
    });
  });
  describe('new', function newSprite() {
    it('should construct a new sprite', function test() {
      assert.equal(sprite.constructor.name, 'Sprite');
    });
  });

  describe('turn', function turn() {
    it('should turn up', function test() {
      sprite.turn(Orientation.enums.up);
      assert.equal(sprite.direction, Orientation.enums.up);
      assert.equal(sprite.rotation, 0);
    });
    it('should turn down', function test() {
      sprite.turn(Orientation.enums.down);
      assert.equal(sprite.direction, Orientation.enums.down);
      assert.equal(sprite.rotation, 180);
    });
    it('should turn left', function test() {
      sprite.turn(Orientation.enums.left);
      assert.equal(sprite.direction, Orientation.enums.left);
      assert.equal(sprite.rotation, -90);
    });

    it('should turn right', function test() {
      sprite.turn(Orientation.enums.right);
      assert.equal(sprite.direction, Orientation.enums.right);
      assert.equal(sprite.rotation, 90);
    });
  });

  describe('turnAround', function turnAround() {
    it('should turn from up to down', function test() {
      sprite.turn(Orientation.enums.up);
      sprite.turnAround();
      assert.equal(sprite.direction, Orientation.enums.down);
      assert.equal(sprite.rotation, 180);
    });
    it('should turn from down to up', function test() {
      sprite.turn(Orientation.enums.down);
      sprite.turnAround();
      assert.equal(sprite.direction, Orientation.enums.up);
      assert.equal(sprite.rotation, 0);
    });
    it('should turn from left to right', function test() {
      sprite.turn(Orientation.enums.left);
      sprite.turnAround();
      assert.equal(sprite.direction, Orientation.enums.right);
      assert.equal(sprite.rotation, 90);
    });

    it('should turn from right to left', function test() {
      sprite.turn(Orientation.enums.right);
      sprite.turnAround();
      assert.equal(sprite.direction, Orientation.enums.left);
      assert.equal(sprite.rotation, -90);
    });
  });

  describe('turnAntiClockwise', function turnAntiClockwise() {
    it('should turn from up to left', function test() {
      sprite.turn(Orientation.enums.up);
      sprite.turnAntiClockwise();
      assert.equal(sprite.direction, Orientation.enums.left);
      assert.equal(sprite.rotation, -90);
    });
    it('should turn from down to right', function test() {
      sprite.turn(Orientation.enums.down);
      sprite.turnAntiClockwise();
      assert.equal(sprite.direction, Orientation.enums.right);
      assert.equal(sprite.rotation, 90);
    });
    it('should turn from left to down', function test() {
      sprite.turn(Orientation.enums.left);
      sprite.turnAntiClockwise();
      assert.equal(sprite.direction, Orientation.enums.down);
      assert.equal(sprite.rotation, 180);
    });

    it('should turn from right to up', function test() {
      sprite.turn(Orientation.enums.right);
      sprite.turnAntiClockwise();
      assert.equal(sprite.direction, Orientation.enums.up);
      assert.equal(sprite.rotation, 0);
    });
  });

  describe('turnProClockwise', function turnProClockwise() {
    it('should turn from up to right', function test() {
      sprite.turn(Orientation.enums.up);
      sprite.turnProClockwise();
      assert.equal(sprite.direction, Orientation.enums.right);
      assert.equal(sprite.rotation, 90);
    });
    it('should turn from down to left', function test() {
      sprite.turn(Orientation.enums.down);
      sprite.turnProClockwise();
      assert.equal(sprite.direction, Orientation.enums.left);
      assert.equal(sprite.rotation, -90);
    });
    it('should turn from left to up', function test() {
      sprite.turn(Orientation.enums.left);
      sprite.turnProClockwise();
      assert.equal(sprite.direction, Orientation.enums.up);
      assert.equal(sprite.rotation, 0);
    });

    it('should turn from right to down', function test() {
      sprite.turn(Orientation.enums.right);
      sprite.turnProClockwise();
      assert.equal(sprite.direction, Orientation.enums.down);
      assert.equal(sprite.rotation, 180);
    });
  });


  describe('getRotation', function getRotation() {
    it('should return 0', function test() {
      sprite.direction = Orientation.enums.up;
      assert.equal(sprite.getRotation(), 0);
    });

    it('should return 180', function test() {
      sprite.direction = Orientation.enums.down;
      assert.equal(sprite.getRotation(), 180);
    });

    it('should return -90', function test() {
      sprite.direction = Orientation.enums.left;
      assert.equal(sprite.getRotation(), -90);
    });

    it('should return 90', function test() {
      sprite.direction = Orientation.enums.right;
      assert.equal(sprite.getRotation(), 90);
    });
  });
  describe('getTarget', function getTarget() {
    describe('up', function up() {
      it('should return the up coordinates', function test() {
        sprite.direction = Orientation.enums.up;
        sprite.position = { x: 15, y: 15 };
        assert.deepEqual(sprite.getTarget(), { x: 15, y: 14 });
      });
      it('should return the wraparound up coordinates', function test() {
        sprite.direction = Orientation.enums.up;
        sprite.position = { x: 15, y: 0 };
        assert.deepEqual(sprite.getTarget(), { x: 15, y: 19 });
      });
    });
    describe('down', function down() {
      it('should return the down coordinates', function test() {
        sprite.direction = Orientation.enums.down;
        sprite.position = { x: 15, y: 15 };
        assert.deepEqual(sprite.getTarget(), { x: 15, y: 16 });
      });
      it('should return the wraparound down coordinates', function test() {
        sprite.direction = Orientation.enums.down;
        sprite.position = { x: 15, y: 19 };
        assert.deepEqual(sprite.getTarget(), { x: 15, y: 0 });
      });
    });

    describe('left', function left() {
      it('should return the left coordinates', function test() {
        sprite.direction = Orientation.enums.left;
        sprite.position = { x: 15, y: 15 };
        assert.deepEqual(sprite.getTarget(), { x: 14, y: 15 });
      });
      it('should return the wraparound left coordinates', function test() {
        sprite.direction = Orientation.enums.left;
        sprite.position = { x: 0, y: 15 };
        assert.deepEqual(sprite.getTarget(), { x: 34, y: 15 });
      });
    });

    describe('right', function right() {
      it('should return the right coordinates', function test() {
        sprite.direction = Orientation.enums.right;
        sprite.position = { x: 15, y: 15 };
        assert.deepEqual(sprite.getTarget(), { x: 16, y: 15 });
      });
      it('should return the wraparound right coordinates', function test() {
        sprite.direction = Orientation.enums.right;
        sprite.position = { x: 34, y: 15 };
        assert.deepEqual(sprite.getTarget(), { x: 0, y: 15 });
      });
    });
  });
  describe('canMove', function canMove() {
    it('should return true', function test() {
      sprite.position = { x: 15, y: 15 };
      assert.isTrue(sprite.canMove());
    });
    it('should return false because of a wall tile', function test() {
      sprite.position = { x: 1, y: 1 };
      sprite.turn(Orientation.enums.up);
      assert.equal(sprite.game.map.getTileTypeByCoords(sprite.getTarget()), 2);
      assert.isFalse(sprite.canMove({ x: 1, y: 0 }));
    });

    it('should return false because of a wall tile', function test() {
      sprite.position = { x: 1, y: 1 };
      sprite.turn(Orientation.enums.up);
      assert.equal(sprite.game.map.getTileTypeByCoords(sprite.getTarget()), 2);
      assert.isFalse(sprite.canMove({ x: 1, y: 0 }));
    });
  });
});

// describe('template', function template() {
//   it('should ______', function test() {
//     sprite.property = null;
//     sprite.method(arg);
//     assert.equal(sprite.something, 2);
//     assert.isTrue(sprite.something(arg));
//   });
// });
