let Game = require('../Scripts/Game');
describe('Game', function () {
  let game = new Game();
  describe('properties', function () {
    it('should have all maps in this.levels', function () {
      assert.isNotNull(game.levels);
      assert.isDefined(game.levels['0']);
      assert.equal(game.levels['0'].width, 15);
    });
  });
  describe('resetLevelVariables()', function () { });
  describe('returnToTitle()', function () { });
  describe('setDeadMessage()', function () { });
  describe('setProperties()', function () { });
  describe('nextLevel()', function () { });
});
