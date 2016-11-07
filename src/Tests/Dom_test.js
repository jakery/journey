let Dom = require('../Scripts/Helpers/Dom');
describe('Dom', function () {
  let myElement;
  let myDom;
  beforeEach(function () {
    myElement = document.createElement('div');
    myElement.innerHTML = 'test div';
    document.body.appendChild(myElement);
    myDom = new Dom(myElement);
  });
  describe('new', function () {
    it('should be a new Dom object.', function () {
      assert.equal(myDom.element.innerHTML, 'test div');
      assert.isTrue(typeof myDom.style === 'function');
    });
  });
  describe('.before(text)', function () {
    it('should insert text (html) just before the element', function () {
      myDom.before('<div id="newElement">I\'m new!</div>');
      let newElement = myElement.previousSibling;
      assert.equal(newElement.tagName.toLowerCase(), 'div');
      assert.equal(newElement.id, 'newElement');
    });
    it('should return the dom object.', function () {
      assert.deepEqual(myDom.before(), myDom);
    });
  });
  describe('.style()', function () {
    it('should set the color style to red.', function () {
      myDom.style('color', 'red');
      assert.equal(myDom.element.style.color, 'red');
    });
    it('should output the element\'s CSSStyleDeclaration', function () {
      var theStyle = myDom.style();
      assert.equal(theStyle.constructor.name, 'CSSStyleDeclaration');
    });
    it('should output the element\'s single style value.', function () {
      myDom.style('color', 'green');
      const theStyle = myDom.style('color');
      assert.equal(theStyle, 'green');
    });
  });

  describe('.width()', function width() {
    it('should return the width of the element.', function test() {
      let width = myDom.width();
      assert.isNumber(width);
    });
  });
  describe('.height()', function () {
    it('should return the height of the element.', function test() {
      let height = myDom.height();
      assert.isNumber(height);
    });
  });

  describe('.hide()', function () {
    it('should hide the element.', function () {
      myDom.hide();
      assert.equal(myDom.element.style.visibility, 'hidden');
    });
    it('should return the dom object.', function () {
      assert.deepEqual(myDom.hide(), myDom);
    });
  });

  describe('.show()', function () {
    it('should show the element.', function () {
      myDom.show();
      assert.equal('visible', myDom.element.style.visibility)
    });
    it('should return the dom object.', function () {
      assert.deepEqual(myDom, myDom.show());
    });
  });

  describe('.html()', function () {
    it('should set the html', function () {
      throw new Error('not implemented.');
    });
  });

  describe('.ready()', function () {
    it('should execute a callback when the document is loaded.', function () {
      let myNumber = 1;
      let myDocument = new Dom(document);
      let callbackExecuted = false;

      let myCallback = function myCallback() {
        callbackExecuted = true;
      };
      myDocument.ready(myCallback);

      // Manually trigger DOMContentLoaded.
      var DOMContentLoaded_event = document.createEvent("Event")
      DOMContentLoaded_event.initEvent("DOMContentLoaded", true, true)
      window.document.dispatchEvent(DOMContentLoaded_event);

      assert.isTrue(callbackExecuted);

    });

    it('should return the dom object.', function () {
      assert.deepEqual(myDom, myDom.ready());
    });
  });
  describe('.remove()', function () {
    it("should remove the element from the document.", function () {
      let myElementToRemove = document.createElement('div');
      myElementToRemove.innerHTML = 'remove me';
      myElementToRemove.id = 'myDiv';
      document.body.appendChild(myElementToRemove);
      let myDomToRemove = new Dom(myElementToRemove);
      let parentElement = myElementToRemove.parentNode;
      let check = document.getElementById('myDiv');
      assert.isTrue(check.id === 'myDiv');

      myDomToRemove.remove();

      let reCheck = document.getElementById('myDiv');
      assert.isTrue(reCheck === null);
    });
  });

});

