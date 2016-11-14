/* eslint-disable prefer-arrow-callback */
const Init = require('../Scripts/Init');

describe('Init()', function InitTests() {
  const mainDiv = document.createElement('div');
  mainDiv.id = 'main';
  document.body.appendChild(mainDiv);
  const myInit = new Init();
  beforeEach(function beforeEach() {

  });
  describe('handleTouchScreen()', function handleTouchScreen() {
    it('should return true', function test() {
      assert.isTrue(myInit.handleTouchScreen(true));
    });
    // TODO: Add spy for when bypass is set to false.
  });
  describe('checkBrowserSupport()', function checkBrowserSupport() {
    it('should return true', function test() {
      assert.isTrue(myInit.checkBrowserSupport());
    });
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
  describe('bypass()', function bypass() {
    // TODO: Add bypass spy.
  });
});
