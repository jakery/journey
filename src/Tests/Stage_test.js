let Stage = require('../Scripts/Stage');
describe('Stage', function () {
  let gameCanvas = document.createElement('canvas');
  gameCanvas.id = 'gameCanvas';
  document.body.appendChild(gameCanvas);
  let myStage = new Stage();
  myStage.init();
  beforeEach(function () {
  });
  describe('.init()', function () {
    it('should have a width and height.', function () {
      assert.isNumber(myStage.width);
      assert.isNumber(myStage.height);
    });
    it('should have a playbox width and playbox height.', function () {
      assert.isNumber(myStage.playboxWidth);
      assert.isNumber(myStage.playboxHeight);
    });

  });
});

