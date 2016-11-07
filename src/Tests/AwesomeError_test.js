let AwesomeError = require('../Scripts/AwesomeError');
describe('AwesomeError', function () {
  describe('create', function () {
    it('should create the awesome error message.', function () {
      let awesomeError = new AwesomeError({
        attemptedFunction: 'unitTest',
        errorCode: '404',
        position: {x: 0, y: 5},
        level: 1,
      });
      assert.include(awesomeError.message, "Attempted function : unitTest");
      assert.include(awesomeError.message, "unitTest");
    });
  });
  describe('additional unit tests', function(){
    it('should be around', function(){
      throw new Error (`but they just ain't here!!!`);
    });
  });
});
