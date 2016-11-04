
let Utility = require('../Scripts/Utility');
let Coordinates = require('../Scripts/Coordinates');
describe('Utility', () => {
  describe('tileDistanceBetween', function () {
    it('should return 1', function () {
      const sprite1 = new Coordinates(-1, -1);
      const sprite2 = new Coordinates(-2, -1);
      assert.equal(Utility.tileDistanceBetween(sprite1, sprite2), 1);
    });
    it('should return 5', function () {
      const sprite1 = new Coordinates(10, 50);
      const sprite2 = new Coordinates(8, 47);
      assert.equal(Utility.tileDistanceBetween(sprite1, sprite2), 5);
    });
  });
  describe('areColliding', function () {
    it('should return true', function () {
      const sprite1 = new Coordinates(5, 5);
      const sprite2 = new Coordinates(5, 5);
      assert.isTrue(Utility.areColliding(sprite1, sprite2));
    });
  });

  describe('Dom', function () {
    const myElement = document.createElement('div');
    myElement.innerHTML = 'test div';
    const myDom = new Utility.Dom(myElement);

    describe('new', function () {
      it('should be a new Dom object.', function () {
        assert.equal(myDom.element.innerHTML, 'test div');
        assert.isTrue(typeof myDom.style === 'function');
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

    describe('.ready()', function () {
      it('should execute a callback when the document is loaded.', function () {
        let myNumber = 1;
        let myDocument = new Utility.Dom(document);
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



  });
});
