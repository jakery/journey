/* eslint-disable prefer-arrow-callback */
const Levels = require('../../src/Scripts/Map/Levels');

describe('Levels', function LevelsTests() {
  describe('load()', function load() {
    it('should load a bunch of JSON files into a single object.', function test() {
      const levels = Levels.load(true);
      assert.isNotNull(levels);
      assert.isDefined(levels.testMap);
      assert.equal(levels.testMap.width, 35);
    });
  });
});
