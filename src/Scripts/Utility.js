// Shim for missing console object.

let console;
if (typeof console === 'undefined') {
  const console = {
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
}

const currencyPattern = /,|$/g;
// // String prototype functions.

// Convert currency string to float.
String.prototype.parseFloatCurrency = function () {
  return parseFloat(this.replace(currencyPattern, ''));
};

// Convert currency string to integer.
String.prototype.parseIntCurrency = function (radix) {
  // Default to Base-10.
  return parseInt(this.replace(currencyPattern, ''), radix || 10);
};

// Convert number to formatted currency string.
String.prototype.formatCurrency = function () {
  let num = this;
  num = num.toString().replace(currencyPattern, '');
  if (isNaN(num))
  { num = '0'; }
  sign = (num !== (num = Math.abs(num)));
  num = Math.floor(num * 100 + 0.50000000001);
  cents = num % 100;
  num = Math.floor(num / 100).toString();
  if (cents < 10)
  { cents = `0${cents}`; }
  for (let i = 0; i < Math.floor((num.length - (1 + i)) / 3); i += 1) {
    num = `${num.substring(0, num.length - (4 * i + 3))},${
      num.substring(num.length - (4 * i + 3))}`;
  }
  return (`${(sign) ? '' : '-'}$${num}.${cents}`);
};

// Trim whitespace from string.
String.prototype.trim = function () {
  return this.replace(/^\s+|\s+$/g, '');
};
String.prototype.ltrim = function () {
  return this.replace(/^\s+/, '');
};
String.prototype.rtrim = function () {
  return this.replace(/\s+$/, '');
};


// // Array prototype functions.

// Return sum of all numbers in array.
Array.prototype.sum = function () {
  for (var i = 0, sum = 0; i < this.length; sum += this[i += 1]);
  return sum;
};

// / <summary>
// / Remove all items from array by value.
// / </summary>
Array.prototype.remove = function () {
  let what,
    a = arguments,
    L = a.length,
    ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

// / <summary>
// / Get object within array by value of property within object.
// / </summary>
Array.prototype.findByProperty = function (propertyName, value, safe) {
  for (let i = 0; i < this.length; i += 1) {
    if (this[i][propertyName] === value) {
      return this[i];
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
Array.prototype.findAllByProperty = function (propertyName, value, safe) {
  const outputArray = [];
  for (let i = 0; i < this.length; i += 1) {
    if (this[i][propertyName] === value) {
      outputArray.push(this[i]);
    }
  }

  if (outputArray.length === 0 && !safe) {
    throw new Error(`Couldn't find any objects with property "${propertyName}" having a value of "${value}".`);
  }
  return outputArray;
};

Array.prototype.getRandomElement = function () {
  return this[Math.floor(Math.random() * this.length)];
};
// / Split array into multidimensional array.
Array.prototype.chunk = function (chunkSize) {
  const array = this;
  return [].concat.apply([],
    array.map((elem, i) => {
      return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
    })
  );
};

// Max value of numerical array.
Array.prototype.max = function () {
  return Math.max.apply(null, this);
};

// Min value of numerical array.
Array.prototype.min = function () {
  return Math.min.apply(null, this);
};

CanvasRenderingContext2D.prototype.centerText = function (text, minX, maxX, y) {
  const width = maxX - minX;
  const middle = minX + Math.floor(width / 2);
  const metrics = this.measureText(text);
  const textWidth = metrics.width;
  const centeredX = middle - Math.floor(textWidth / 2);
  this.fillText(text, centeredX, y);
};

// Canvas prototype functions.
CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight) {
  let yAdjusted = y;
  let lines = text.split('\\n');
  if (lines.length !== 1) {
    lines = text.split('\n');
  }

  for (let i = 0; i < lines.length; i += 1) {
    const words = lines[i].split(' ');
    let line = '';

    for (let n = 0; n < words.length; n += 1) {
      const testLine = `${line + words[n]} `;
      const metrics = this.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        this.fillText(line, x, yAdjusted);
        line = `${words[n]} `;
        yAdjusted += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.fillText(line, x, yAdjusted);
    yAdjusted += lineHeight;
  }
};
