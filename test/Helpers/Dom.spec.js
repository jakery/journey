/* eslint-disable prefer-arrow-callback */
const Dom = require('./Dom');

describe('Dom', function DomTests() {
  let myElement;
  let myDom;
  beforeEach(function beforeEach() {
    myElement = document.createElement('div');
    myElement.innerHTML = 'test div';
    document.body.appendChild(myElement);
    myDom = new Dom(myElement);
  });
  describe('new', function newDom() {
    it('should be a new Dom object.', function test() {
      assert.equal(myDom.element.innerHTML, 'test div');
      assert.isTrue(typeof myDom.style === 'function');
    });
  });
  describe('.before(text)', function before() {
    it('should insert text (html) just before the element', function test() {
      myDom.before('<div id="newElement">I\'m new!</div>');
      const newElement = myElement.previousSibling;
      assert.equal(newElement.tagName.toLowerCase(), 'div');
      assert.equal(newElement.id, 'newElement');
    });
    it('should return the dom object.', function test() {
      assert.deepEqual(myDom.before(), myDom);
    });
  });
  describe('.style()', function style() {
    it('should set the color style to red.', function test() {
      myDom.style('color', 'red');
      assert.equal(myDom.element.style.color, 'red');
    });
    it('should output the element\'s CSSStyleDeclaration', function test() {
      const theStyle = myDom.style();
      assert.equal(theStyle.constructor.name, 'CSSStyleDeclaration');
    });
    it('should output the element\'s single style value.', function test() {
      myDom.style('color', 'green');
      const theStyle = myDom.style('color');
      assert.equal(theStyle, 'green');
    });
  });

  describe('.width()', function descrtibeWidth() {
    it('should return the width of the element.', function test() {
      const width = myDom.width();
      assert.isNumber(width);
    });
  });
  describe('.height()', function height() {
    it('should return the height of the element.', function test() {
      const myHeight = myDom.height();
      assert.isNumber(myHeight);
    });
  });

  describe('.hide()', function hide() {
    it('should hide the element.', function test() {
      myDom.hide();
      assert.equal(myDom.element.style.visibility, 'hidden');
    });
    it('should return the dom object.', function test() {
      assert.deepEqual(myDom.hide(), myDom);
    });
  });

  describe('.show()', function show() {
    it('should show the element.', function test() {
      myDom.show();
      assert.equal('visible', myDom.element.style.visibility);
    });
    it('should return the dom object.', function test() {
      assert.deepEqual(myDom, myDom.show());
    });
  });

  describe('.html()', function html() {
    it('should GET the innerHTML of the element.', function test() {
      assert.equal(myDom.html(), myElement.innerHTML);
    });
    it('should SET the innerHTML of the element.', function test() {
      const newHtml = 'NEW HTML VALUE';
      myDom.html(newHtml);
      assert.equal(myElement.innerHTML, newHtml);
    });
  });

  describe('.ready()', function ready() {
    it('should execute a callback when the document is loaded.', function test() {
      const myDocument = new Dom(document);
      let callbackExecuted = false;

      const myCallback = function myCallback() {
        callbackExecuted = true;
      };
      myDocument.ready(myCallback);

      // Manually trigger DOMContentLoaded.
      const domContentLoadedEvent = document.createEvent('Event');
      domContentLoadedEvent.initEvent('DOMContentLoaded', true, true);
      window.document.dispatchEvent(domContentLoadedEvent);

      assert.isTrue(callbackExecuted);
    });

    it('should return the dom object', function test() {
      assert.deepEqual(myDom, myDom.ready());
    });
  });
  describe('.remove()', function remove() {
    it('should remove the element from the document', function test() {
      const myElementToRemove = document.createElement('div');
      myElementToRemove.innerHTML = 'remove me';
      myElementToRemove.id = 'myDiv';
      document.body.appendChild(myElementToRemove);
      const myDomToRemove = new Dom(myElementToRemove);
      const check = document.getElementById('myDiv');
      assert.isTrue(check.id === 'myDiv');

      myDomToRemove.remove();

      const reCheck = document.getElementById('myDiv');
      assert.isTrue(reCheck === null);
    });
    it('should return the dom object.', function test() {
      assert.deepEqual(myDom.remove(), myDom);
    });
  });
});
