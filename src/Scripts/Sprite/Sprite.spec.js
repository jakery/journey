/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-unused-expressions */
const TileCodes = require('../Constants/TileCodes');
const Orientation = require('./Orientation');
const Coordinates = require('../Coordinates');
const Sprite = require('./Sprite');
const Map = require('../Map/Map');
const Game = require('../Game');
// eslint-disable-next-line
const testMap = require('json!../Map/Mocks/testMap.json');

describe('Sprite', function SpriteTests() {
  let sprite;
  let game;

  beforeEach(function beforeEach() {
    game = new Game();
    game.map = new Map(testMap);
    sprite = new Sprite.Sprite(game);
    sprite.inventory = {};
  });
  describe('new', function newSprite() {
    it('should construct a new sprite', function test() {
      assert.equal(sprite.constructor.name, 'Sprite');
    });
  });

  describe('movement', function movement() {
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
      describe('blockers', function blockers() {
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

        // TODO: The pushblock test can't properly be run
        //       until more of the game object is unraveled from app.js
        it.skip('should return false when trying to push a pushblock', function test() {
          const myPushblock = new Sprite.Sprite(game);
          Object.assign(myPushblock, { position: new Coordinates(1, 1), type: 'tool', subType: 'pushBlock' });
          sprite.game.tools.push(myPushblock);
          sprite.position = { x: 1, y: 2 };
          sprite.turn(Orientation.enums.up);
          assert.isFalse(sprite.canMove());
          myPushblock.position = { x: 5, y: 5 };
          sprite.position = { x: 4, y: 5 };
          sprite.turn(Orientation.enums.right);
          assert.isTrue(sprite.canMove());
        });

        // it('***TEST THING***', function test() {
        //   assert.equal(
        //     0,
        //     [sprite.game.tools[0].position, sprite.game.tools[1].position]
        //   );
        // });

        // it('***TEST THING***', function test() {
        //   const indexes = sprite.game.map.getAllIndexesOfTile(TileCodes.toll);
        //   assert.equal(
        //     0,
        //     [indexes, sprite.game.map.getCoordsByTileIndex(indexes[0])]
        //   );
        // });
        // it('***TEST THING***', function test() {
        //   const indexes = sprite.game.map.getAllIndexesOfTile(TileCodes.toll);
        //   assert.equal(
        //     0,
        //     [indexes, sprite.game.map.getCoordsByTileIndex(indexes[0])]
        //   );
        // });
      });
    });

    describe('goForward', function goForward() {
      it('moves to the tile from the adjacent tile', function test() {
        sprite.position = { x: 16, y: 0 };
        sprite.turn(Orientation.enums.left);
        sprite.goForward();
        assert.deepEqual(sprite.position, { x: 15, y: 0 });
      });
      it('moves to the tile from the adjacent tile, with direction specified', function test() {
        sprite.position = { x: 25, y: 3 };
        sprite.turn(Orientation.enums.left);
        sprite.goForward(Orientation.enums.up);
        assert.deepEqual(sprite.position, { x: 25, y: 2 });
      });
    });
  });

  describe('registerHit', function registerHit() {
    it('should return false when the sprite is dead', function test() {
      sprite.isAlive = false;
      assert.isFalse(sprite.registerHit({}));
    });

    it('should activate the red switch', function test() {
      expect(game.redSwitch).to.be.false;
      const redSwitch = new Sprite.Sprite(game);
      redSwitch.subType = 'switch';
      redSwitch.color = 'red';
      redSwitch.registerHit({});
      expect(game.redSwitch).to.be.true;
    });

    it('should activate the yellow switch', function test() {
      expect(game.yellowSwitch).to.be.false;
      const yellowSwitch = new Sprite.Sprite(game);
      yellowSwitch.subType = 'switch';
      yellowSwitch.color = 'yellow';
      yellowSwitch.registerHit({});
      expect(game.yellowSwitch).to.be.true;
    });

    it('should activate the green switch', function test() {
      expect(game.greenSwitch).to.be.false;
      const greenSwitch = new Sprite.Sprite(game);
      greenSwitch.subType = 'switch';
      greenSwitch.color = 'green';
      greenSwitch.registerHit({});
      expect(game.greenSwitch).to.be.true;
    });
    it('should activate the brown switch', function test() {
      expect(game.brownSwitch).to.be.false;
      const brownSwitch = new Sprite.Sprite(game);
      brownSwitch.subType = 'switch';
      brownSwitch.color = 'brown';
      brownSwitch.registerHit({});
      expect(game.brownSwitch).to.be.true;
    });

    it('should activate the brown switch', function test() {
      game.brownSwitch = true;
      expect(game.brownSwitch).to.be.true;
      const brownSwitch = new Sprite.Sprite(game);
      brownSwitch.subType = 'switch';
      brownSwitch.color = 'brownOff';
      brownSwitch.registerHit({});
      expect(game.brownSwitch).to.be.false;
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
