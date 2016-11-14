/* eslint-disable prefer-arrow-callback */
const Constants = require('./Constants/Constants');
const Game = require('../Scripts/Game');

describe('Game', function GameTests() {
  const game = new Game();
  describe('properties', function properties() {
    it('should have all maps in this.levels', function test() {
      assert.isNotNull(game.levels);
      assert.isDefined(game.levels['0']);
      assert.equal(game.levels['0'].width, 15);
    });
  });
  describe('resetLevelVariables()', function resetLevelVariables() { });
  describe('returnToTitle()', function returnToTitle() {
    game.level = 50;
    game.nextLevelNumber = 51;
    game.winMessage = 'You\'ve won!';
    game.mode = Constants.gameModes.normal;
    game.returnToTitle();
    assert.equal(game.level, 0);
    assert.equal(game.mode, Constants.gameModes.title);
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
    game.setProperties({ foo: 'bar' });
    assert.equal(game.foo, 'bar');
  });
  describe('restartLevel()', function restartLevel() {
    // game.restartLevel();
    // TODO: Add spy for game.loadMap(level)
  });
});
