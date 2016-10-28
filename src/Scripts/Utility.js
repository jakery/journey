define('Utility', [], () => {
  const Utility = function () {
    this.tileDistanceBetween = function tileDistanceBetween(coords1, coords2) {
      const xDist = Math.abs(coords1.x - coords2.x);
      const yDist = Math.abs(coords1.y - coords2.y);
      return xDist + yDist;
    };

    this.areColliding = function areColliding(pos1, pos2) {
      return pos1.x == pos2.x && pos1.y == pos2.y;
    };

    this.areSpritesColliding = function areSpritesColliding(s1, s2) {
      return this.areColliding(s1.position, s2.position);
    };

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

    this.string = new (function () {
      const currencyPattern = /,|$/g;

      // Convert currency string to float.
      this.parseFloatCurrency = function () {
        return parseFloat(this.replace(currencyPattern, ''));
      };

      // Convert currency string to integer.
      this.parseIntCurrency = function (radix) {
        // Default to Base-10.
        return parseInt(this.replace(currencyPattern, ''), radix || 10);
      };

      // Convert number to formatted currency string.
      this.formatCurrency = function (number) {
        let n = number;
        n = n.toString().replace(currencyPattern, '');
        if (isNaN(n)) { n = '0'; }
        const sign = (n !== (n = Math.abs(n)));
        n = Math.floor(n * 100 + 0.50000000001);
        let cents = n % 100;
        n = Math.floor(n / 100).toString();
        if (cents < 10) { cents = `0${cents}`; }
        for (let i = 0; i < Math.floor((n.length - (1 + i)) / 3); i += 1) {
          n = `${n.substring(0, n.length - (4 * i + 3))},${
            n.substring(n.length - (4 * i + 3))}`;
        }
        return (`${(sign) ? '' : '-'}$${n}.${cents}`);
      };

      // Trim whitespace from string.
      this.trim = function (string) {
        return string.replace(/^\s+|\s+$/g, '');
      };
      this.ltrim = function (string) {
        return string.replace(/^\s+/, '');
      };
      this.rtrim = function (string) {
        return string.replace(/\s+$/, '');
      };
    })();

    this.array = new (function () {
      // Return sum of all numbers in array.
      // TODO: Unit test this.
      this.sum = function (array) {
        let sum = 0;
        for (let i = 0; i < array.length; sum += array[i += 1]);
        return sum;
      };

      // / <summary>
      // / Remove all items from array by value.
      // / </summary>
      // TODO: Unit test this.
      this.remove = function (array) {
        let what;
        let L = arguments.length;
        let ax;
        while (L && array.length) {
          L -= 1;
          what = arguments[L];
          ax = array.indexOf(what);
          while (ax !== -1) {
            array.splice(ax, 1);
            ax = array.indexOf(what);
          }
        }
        return this;
      };

      // / <summary>
      // / Get object within array by value of property within object.
      // / </summary>
      this.findByProperty = function (array, propertyName, value, safe) {
        for (let i = 0; i < array.length; i += 1) {
          if (array[i][propertyName] === value) {
            return array[i];
          }
        }
        if (safe) {
          return null;
        }
        throw new Error(`Couldn't find object with property "${propertyName}" having a value of "${value}".`);
      };

      // / <summary>
      // / Get ALL objects within array by value of property within object.
      // / </summary>
      this.findAllByProperty = function (array, propertyName, value, safe) {
        const outputArray = [];
        for (let i = 0; i < array.length; i += 1) {
          if (array[i][propertyName] === value) {
            outputArray.push(array[i]);
          }
        }

        if (outputArray.length === 0 && !safe) {
          throw new Error(`Couldn't find any objects with property "${propertyName}" having a value of "${value}".`);
        }
        return outputArray;
      };

      this.getRandomElement = function (array) {
        return array[Math.floor(Math.random() * array.length)];
      };
      // / Split array into multidimensional array.
      this.chunk = function (array, chunkSize) {
        return [].concat.apply([],
          array.map((elem, i) => {
            return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
          })
        );
      };

      // Max value of numerical array.
      this.max = function (array) {
        return Math.max.apply(null, array);
      };

      // Min value of numerical array.
      this.min = function (array) {
        return Math.min.apply(null, array);
      };
    })();

    this.math = {
      toRadians: function (degrees) { return degrees * Math.PI / 180; },
      toDegrees: function (radians) { return radians * 180 / Math.PI; }
    }
  };

  return new Utility();
});
