// jQuery's greatest hits, but much lighter.
define('Dom', [], () => function Dom(element) {
  if (element === null) {
    throw new Error('The element argument for the Dom node cannot be null.');
  }
  if (element.isArray) {
    this.element = element;
    this.length = element.length;
  } else {
    this[0] = element;
    this.element = this[0];
    this.length = 1;
  }
  this.before = function before(htmlText) {
    this.element.insertAdjacentHTML('beforeBegin', htmlText);
    return this;
  };
  this.style = function style(name, value) {
    if (name == null) {
      return this.element.style;
    } else if (value == null) {
      return this.element.style[name];
    }
    this.element.style[name] = value;
    return this;
  };
  this.width = function width() {
    return Math.max(this.element.scrollWidth, this.element.offsetWidth, this.element.clientWidth);
  };
  this.height = function height() {
    return Math.max(this.element.scrollHeight, this.element.offsetHeight, this.element.clientHeight);
  };
  this.hide = function hide() {
    this.style('visibility', 'hidden');
    return this;
  };
  this.show = function show() {
    this.style('visibility', 'visible');
    return this;
  };
  this.html = function html(value) {
    if (typeof value !== 'string') {
      return this.element.innerHTML;
    }
    this.element.innerHTML = value;
    return this;
  };
  this.ready = function ready(callback) {
    this.element.addEventListener('DOMContentLoaded', callback);
    return this;
  };
  this.remove = function remove() {
    this.element.parentNode.removeChild(this.element);
    return this;
  };
  return this;
});
