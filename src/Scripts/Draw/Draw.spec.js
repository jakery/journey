/* eslint-disable prefer-arrow-callback */
const Coordinates = require('../Coordinates');
const Draw = require('./Draw');
// eslint-disable-next-line
const testMap = require('json!../Map/Mocks/testMap.json');

describe('Draw', function DrawTests() {
  describe('tileIsInDrawBounds', function tileIsInDrawBounds() {
    const canvas = document.createElement('canvas');
    const game = {
      map: testMap,
    };
    const stage = {
      playboxWidth: 15 * 32,
      playboxHeight: 12 * 32,
      gameCanvas: canvas,
    };
    const player = {};
    const draw = new Draw(game, stage, player);
    it('should return true', function test() {
      const coords = new Coordinates(64, 64);
      assert.isTrue(draw.tileIsInDrawBounds(coords));
    });
    it('should return false', function test() {
      const coords = new Coordinates(-32, 10000);
      assert.isFalse(draw.tileIsInDrawBounds(coords));
    });
  });
});
