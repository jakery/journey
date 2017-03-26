/* eslint-disable prefer-arrow-callback */
const Stage = require('../Scripts/Stage');

describe('Stage', function StageTests() {
  const gameCanvas = document.createElement('canvas');
  gameCanvas.id = 'gameCanvas';
  document.body.appendChild(gameCanvas);
  const myStage = new Stage();
  myStage.init();
  beforeEach(function beforeEach() {
  });
  describe('.init()', function init() {
    it('should have a width and height.', function test() {
      assert.isNumber(myStage.width);
      assert.isNumber(myStage.height);
    });
    it('should have a playbox width and playbox height.', function test() {
      assert.isNumber(myStage.playboxWidth);
      assert.isNumber(myStage.playboxHeight);
    });
  });
});

