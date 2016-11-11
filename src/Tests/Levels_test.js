let Levels = require('../Scripts/Map/Levels');
describe('Levels', function () {
  describe('load()', function () {
    it('should load a bunch of JSON files into a single object.', function () {
      const levels = Levels.load(true);
      assert.isNotNull(levels);
      assert.isDefined(levels['testMap']);
      assert.equal(levels['testMap'].width, 35);
    });
  });
});
