/* eslint-disable prefer-arrow-callback */
const Init = require('../src/Scripts/Init');

describe('Init()', function InitTests() {
  const mainDiv = document.createElement('div');
  mainDiv.id = 'main';
  document.body.appendChild(mainDiv);
  const myInit = new Init();
  describe('handleTouchScreen()', function handleTouchScreen() {
    it('should return true', function test() {
      assert.isTrue(myInit.handleTouchScreen(true));
    });
    it.skip('should return false and not bypass', function test() {
      // TODO: Add spy for when bypass is set to false.
    });
  });
  describe.skip('checkBrowserSupport()', function checkBrowserSupport() {
    // TODO: Get modernizr as a package and require that package so that this test works.
    // it('should return true', function test() {
    //   assert.isTrue(myInit.checkBrowserSupport());
    // });
  });

  describe('checkProtocol()', function checkProtocol() {
    it('should return true', function test() {
      assert.isTrue(myInit.checkProtocol());
    });
  });
  describe('setStyle()', function setStyle() {
    it('should turn off padding on the main div', function test() {
      myInit.setStyle();
      assert.equal(mainDiv.style.padding, '0px');
    });
  });
  describe.skip('bypass()', function bypass() {
    // TODO: Add bypass spy.
  });
});
