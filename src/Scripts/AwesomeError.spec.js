/* eslint-disable prefer-arrow-callback */
const AwesomeError = require('../Scripts/AwesomeError');

describe('AwesomeError', function AwesomeErrorTests() {
  describe('create', function create() {
    it('should create the awesome error message.', function test() {
      const awesomeError = new AwesomeError({
        attemptedFunction: 'unitTest',
        errorCode: '404',
        position: { x: 0, y: 5 },
        level: 1,
      });
      assert.include(awesomeError.message, 'Attempted function : unitTest');
      assert.include(awesomeError.message, 'unitTest');
    });
  });
  describe('additional unit tests', function tests() {
    it('', function test() {
      // TODO: Create these.
      // Not sure what these should look like yet.
    });
  });
});
