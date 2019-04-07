const ArrayExtensions = require('./Array');
const StringExtensions = require('./StringHelper');
const MathExtensions = require('./Math');

// eslint-disable-next-line
Boolean.prototype.toggle = function () { return !this.valueOf(); }

define('Utility', ['../Constants/ErrorMessages'], (ErrorMessages) => {
  const Utility = function Utility() {
    this.string = StringExtensions;
    this.array = ArrayExtensions;
    Object.assign(this.array, new ArrayExtensions());
    this.math = MathExtensions;

    this.tileDistanceBetween = function tileDistanceBetween(coords1, coords2) {
      const xDist = Math.abs(coords1.x - coords2.x);
      const yDist = Math.abs(coords1.y - coords2.y);
      return xDist + yDist;
    };

    this.areColliding = function areColliding(pos1, pos2) {
      return pos1.x === pos2.x && pos1.y === pos2.y;
    };

    this.areSpritesColliding = function areSpritesColliding(s1, s2) {
      return this.areColliding(s1.position, s2.position);
    };


    // Polyfills
    // TODO: Move to Polyfills.js

    // Shim for missing console object.
    this.console = window.console || {
      assert() { },
      clear() { },
      count() { },
      debug() { },
      dir() { },
      dirxml() { },
      error() { },
      exception() { },
      group() { },
      groupCollapsed() { },
      groupEnd() { },
      info() { },
      log() { },
      profile() { },
      profileEnd() { },
      table() { },
      time() { },
      timeEnd() { },
      timeStamp() { },
      trace() { },
      warn() { },
    };

    // TODO: Refactor magic strings into enumerables.
    this.alert = function alert(message, output = 'popup') {
      if (output.constructor.name === 'Dom') {
        output.show();
        output.html(message);
      } else if (output === 'popup') {
        // eslint-disable-next-line no-alert
        window.alert(message);
      } else if (output === 'console') {
        // eslint-disable-next-line no-console
        console.error(message);
      } else {
        throw new Error(ErrorMessages.alertUtility);
      }
    };
  };

  return new Utility();
});
