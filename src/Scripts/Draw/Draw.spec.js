let Coordinates = require('../Coordinates');
let Draw = require('./Draw');
let testMap = require('json!../Map/Mocks/testMap.json');
describe('Draw', function () {
  describe('tileIsInDrawBounds', function () {
    var canvas = document.createElement('canvas');
    let game = {
      map: testMap,
    };
    let stage = {
      playboxWidth: 15 * 32,
      playboxHeight: 12 * 32,
      gameCanvas: canvas,
    };
    let player = {};
    const draw = new Draw(game, stage, player);
    it('should return true', function () {
      let coords = new Coordinates(64, 64);
      assert.isTrue(draw.tileIsInDrawBounds(coords));
    });
    it('should return false', function () {
      let coords = new Coordinates(-32, 10000);
      assert.isFalse(draw.tileIsInDrawBounds(coords));
    });
  });
});
