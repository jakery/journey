/* eslint-disable prefer-arrow-callback */
const TileCodes = require('../Constants/TileCodes');
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
      assert.equal(sprite.game.map.getTileTypeByCoords(sprite.getTarget()), TileCodes.wall);
      assert.isFalse(sprite.canMove({ x: 1, y: 0 }));
    });

    it('should return appropriate true/false when moving to INACTIVE red block based on red switch flag', function test() {
      sprite.position = { x: 16, y: 6 };
      sprite.turn(Orientation.enums.up);
      assert.equal(
        sprite.game.map.getTileTypeByCoords(sprite.getTarget()),
        TileCodes.dRedBlockInactive
      );
      sprite.game.redSwitch = false;
      assert.isFalse(sprite.canMove());
      sprite.game.redSwitch = true;
      assert.isTrue(sprite.canMove());
    });

    it('should return appropriate true/false when moving to ACTIVE red block based on red switch flag', function test() {
      sprite.position = { x: 17, y: 6 };
      sprite.turn(Orientation.enums.up);
      assert.equal(
        sprite.game.map.getTileTypeByCoords(sprite.getTarget()),
        TileCodes.aRedBlockInactive
      );
      sprite.game.redSwitch = true;
      assert.isFalse(sprite.canMove());
      sprite.game.redSwitch = false;
      assert.isTrue(sprite.canMove());
    });

    it('should return appropriate true/false when moving to INACTIVE yellow block based on yellow switch flag', function test() {
      sprite.position = { x: 16, y: 7 };
      sprite.turn(Orientation.enums.up);
      assert.equal(
        sprite.game.map.getTileTypeByCoords(sprite.getTarget()),
        TileCodes.dYellowBlockInactive
      );
      sprite.game.yellowSwitch = false;
      assert.isFalse(sprite.canMove());
      sprite.game.yellowSwitch = true;
      assert.isTrue(sprite.canMove());
    });

    it('should return appropriate true/false when moving to ACTIVE yellow block based on yellow switch flag', function test() {
      sprite.position = { x: 17, y: 7 };
      sprite.turn(Orientation.enums.up);
      assert.equal(
        sprite.game.map.getTileTypeByCoords(sprite.getTarget()),
        TileCodes.aYellowBlockInactive
      );
      sprite.game.yellowSwitch = true;
      assert.isFalse(sprite.canMove());
      sprite.game.yellowSwitch = false;
      assert.isTrue(sprite.canMove());
    });

    it('should return appropriate true/false when moving to INACTIVE green block based on green switch flag', function test() {
      sprite.position = { x: 16, y: 8 };
      sprite.turn(Orientation.enums.up);
      assert.equal(
        sprite.game.map.getTileTypeByCoords(sprite.getTarget()),
        TileCodes.dGreenBlockInactive
      );
      sprite.game.greenSwitch = false;
      assert.isFalse(sprite.canMove());
      sprite.game.greenSwitch = true;
      assert.isTrue(sprite.canMove());
    });

    it('should return appropriate true/false when moving to ACTIVE green block based on green switch flag', function test() {
      sprite.position = { x: 17, y: 8 };
      sprite.turn(Orientation.enums.up);
      assert.equal(
        sprite.game.map.getTileTypeByCoords(sprite.getTarget()),
        TileCodes.aGreenBlockInactive
      );
      sprite.game.greenSwitch = true;
      assert.isFalse(sprite.canMove());
      sprite.game.greenSwitch = false;
      assert.isTrue(sprite.canMove());
    });

    it('should return false because of an inactive brown switch', function test() {
      sprite.position = { x: 17, y: 3 };
      sprite.turn(Orientation.enums.up);
      sprite.game.brownSwitch = false;
      assert.equal(
        sprite.game.map.getTileTypeByCoords(sprite.getTarget()),
        TileCodes.brownBlockActive
      );
      assert.isFalse(sprite.canMove());
    });

    it('should return false because of an active brown block', function test() {
      sprite.position = { x: 16, y: 3 };
      sprite.turn(Orientation.enums.up);
      sprite.game.brownSwitch = true;
      assert.equal(
        sprite.game.map.getTileTypeByCoords(sprite.getTarget()),
        TileCodes.brownBlockInactive
      );
      assert.isFalse(sprite.canMove());
    });

    it('should return true/false when trying to go through yellow door based on key count', function test() {
      sprite.position = { x: 16, y: 12 };
      sprite.turn(Orientation.enums.up);
      assert.equal(
        sprite.game.map.getTileTypeByCoords(sprite.getTarget()),
        TileCodes.yellowDoor
      );
      sprite.inventory.yellowKeys = 0;
      assert.isFalse(sprite.canMove());
      sprite.inventory.yellowKeys = 1;
      assert.isTrue(sprite.canMove());
    });

    it('should return true/false when trying to go through red door based on key count', function test() {
      sprite.position = { x: 16, y: 10 };
      sprite.turn(Orientation.enums.up);
      assert.equal(
        sprite.game.map.getTileTypeByCoords(sprite.getTarget()),
        TileCodes.redDoor
      );
      sprite.inventory.redKeys = 0;
      assert.isFalse(sprite.canMove());
      sprite.inventory.redKeys = 1;
      assert.isTrue(sprite.canMove());
    });

    it('should return true/false when trying to go through cyan door based on key count', function test() {
      sprite.position = { x: 16, y: 11 };
      sprite.turn(Orientation.enums.up);
      assert.equal(
        sprite.game.map.getTileTypeByCoords(sprite.getTarget()),
        TileCodes.cyanDoor
      );
      sprite.inventory.cyanKeys = 0;
      assert.isFalse(sprite.canMove());
      sprite.inventory.cyanKeys = 1;
      assert.isTrue(sprite.canMove());
    });

    it('should return true/false when trying to go through green door based on key count', function test() {
      sprite.position = { x: 16, y: 13 };
      sprite.turn(Orientation.enums.up);
      assert.equal(
        sprite.game.map.getTileTypeByCoords(sprite.getTarget()),
        TileCodes.greenDoor
      );
      sprite.inventory.greenKeys = 0;
      assert.isFalse(sprite.canMove());
      sprite.inventory.greenKeys = 1;
      assert.isTrue(sprite.canMove());
    });

    it('should return true/false when trying to go through the toll block based on money count', function test() {
      sprite.position = { x: 24, y: 3 };
      sprite.turn(Orientation.enums.up);
      assert.equal(
        sprite.game.map.getTileTypeByCoords(sprite.getTarget()),
        TileCodes.toll
      );
      sprite.game.moneyCount = 20;
      sprite.inventory.money = 0;
      assert.isFalse(sprite.canMove());
      sprite.inventory.money = 21;
      assert.isTrue(sprite.canMove());
    });


    it('***TEST THING***', function test() {
      const indexes = sprite.game.map.getAllIndexesOfTile(TileCodes.toll);
      assert.equal(
        0,
        [indexes, sprite.game.map.getCoordsByTileIndex(indexes[0])]
      );
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
