
let Utility = require('../Scripts/Utility');
let Coordinates = require('../Scripts/Coordinates');
describe('Utility', () => {
  describe('tileDistanceBetween', function () {
    it('should return 1', function () {
      const sprite1 = new Coordinates(-1, -1);
      const sprite2 = new Coordinates(-2, -1);
      assert.equal(1, Utility.tileDistanceBetween(sprite1, sprite2));
    });
    it('should return 5', function () {
      const sprite1 = new Coordinates(10, 50);
      const sprite2 = new Coordinates(8, 47);
      assert.equal(5, Utility.tileDistanceBetween(sprite1, sprite2));
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
        assert.equal('test div', myDom.element.innerHTML);
        assert.isTrue(typeof myDom.style === 'function');
      });
    });

    describe('.style()', function () {
      it('should set the color style to red.', function () {
        myDom.style('color', 'red');
        assert.equal('red', myDom.element.style.color);
      });
      it('should output the element\'s CSSStyleDeclaration', function () {
        var theStyle = myDom.style();
        assert.equal('CSSStyleDeclaration', theStyle.constructor.name);
      });
      it('should output the element\'s single style value.', function () {
        myDom.style('color', 'green');
        const theStyle = myDom.style('color');
        assert.equal('green', theStyle);
      });
    });

    describe('.hide()', function () {
      it('should hide the element.', function () {
        myDom.hide();
        assert.equal('hidden', myDom.element.style.visibility);
      });
      it('should return the dom object.', function () {
        assert.deepEqual(myDom, myDom.hide());
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
        assert.isTrue(false);
      });
      it('should return the dom object.', function () {
        assert.deepEqual(myDom, myDom.ready());
      });
    });



  });
});
