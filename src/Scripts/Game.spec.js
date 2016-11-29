/* eslint-disable prefer-arrow-callback */
const Constants = require('./Constants/Constants');
const Game = require('../Scripts/Game');

describe('Game', function GameTests() {
  let game;
  beforeEach(function beforeEach() {
    game = new Game({});
    game.player = { Inventory: {} };
  });

  describe('properties', function properties() {
    it('should have all maps in this.levels', function test() {
      assert.isNotNull(game.levels);
      assert.isDefined(game.levels['0']);
      assert.equal(game.levels['0'].width, 15);
    });
  });

  describe('resetLevelVariables()', function resetLevelVariables() {
    it('should reset the variables to defaults', function test() {
      game.winMessage = 'WINNER';
      game.isPaused = false;
      game.atExit = true;
      game.gameTimer = 100000;
      game.clock = 10000000;
      game.brownSwitch = true;
      game.resetLevelVariables();
      assert.isNull(game.winMessage);
      assert.isFalse(game.isPaused);
      assert.isFalse(game.atExit);
      assert.equal(game.gameTimer, 0);
      assert.equal(game.clock, -1);
      assert.isFalse(game.brownSwitch);
    });
  });

  describe('returnToTitle()', function returnToTitle() {
    it('should change settings to take player to the title', function test() {
      // TODO: Migrate game.loadMap() and reenable this test.
      game.level = 50;
      game.nextLevelNumber = 51;
      game.winMessage = 'You\'ve won!';
      game.mode = Constants.gameModes.normal;
      // game.returnToTitle();
      // assert.equal(game.level, 0);
      // assert.equal(game.mode, Constants.gameModes.title);
    });
  });

  describe('setDeadMessage()', function setDeadMessage() {
    it('should show the custom message', function test() {
      game.showMessage = false;
      game.setDeadMessage('you are so dead');
      assert.isTrue(game.showMessage);
      assert.equal(game.messageText, `you are so dead\n\nPress enter to restart.`);
    });
  });

  describe('setProperties()', function setProperties() {
    it('should append a new property', function test() {
      game.setProperties({ foo: 'bar' });
      assert.equal(game.foo, 'bar');
    });
  });

  describe.skip('nextLevel()', function nextLevel() {
    it('should load the current level', function test() {
      // game.nextLevel();
      // Migrate code from App.js and create tests.
    });
  });

  describe.skip('restartLevel()', function restartLevel() {
    it('should reload the current level', function test() {
      // game.restartLevel();
      // TODO: Add spy for game.loadMap(level)
    });
  });
});
