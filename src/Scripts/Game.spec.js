/* eslint-disable prefer-arrow-callback */
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
  describe('returnToTitle()', function returnToTitle() { });
  describe('setDeadMessage()', function setDeadMessage() { });
  describe('setProperties()', function setProperties() {
    game.setProperties({ foo: 'bar' });
    assert.equal(game.foo, 'bar');
  });
  describe('restartLevel()', function restartLevel() {
    // game.restartLevel();
    // TODO: Add spy for game.loadMap(level)
  });
});
