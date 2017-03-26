/* eslint-disable prefer-arrow-callback */
const Player = require('./Player');

describe('Player', function PlayerTests() {
  describe('new', function newPlayer() {
    it('should create a player object', function test() {
      assert.equal(Player.constructor.name, 'Function');
    });
  });
});
