// Shim for missing console object.
if (typeof (console) == "undefined") {
    var console = {
        assert: function () { },
        clear: function () { },
        count: function () { },
        debug: function () { },
        dir: function () { },
        dirxml: function () { },
        error: function () { },
        exception: function () { },
        group: function () { },
        groupCollapsed: function () { },
        groupEnd: function () { },
        info: function () { },
        log: function () { },
        profile: function () { },
        profileEnd: function () { },
        table: function () { },
        time: function () { },
        timeEnd: function () { },
        timeStamp: function () { },
        trace: function () { },
        warn: function () { }
    }
}

//// String prototype functions.

// Convert currency string to float.
String.prototype.parseFloatCurrency = function () {
    return parseFloat(this.replace(/\,|\$/g, ""));
}

// Convert currency string to integer.
String.prototype.parseIntCurrency = function (radix) {
    // Default to Base-10.
    return parseInt(this.replace(/\,|\$/g, ""), radix || 10);
}

// Convert number to formatted currency string.
String.prototype.formatCurrency = function () {
    var num = this;
    num = num.toString().replace(/\$|\,/g, '');
    if (isNaN(num))
        num = "0";
    sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
        cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
        num = num.substring(0, num.length - (4 * i + 3)) + ',' +
            num.substring(num.length - (4 * i + 3));
    return (((sign) ? '' : '-') + '$' + num + '.' + cents);
}

// Trim whitespace from string.
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, "");
}
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, "");
}


//// Array prototype functions.

// Return sum of all numbers in array.
Array.prototype.sum = function () {
    for (var i = 0, sum = 0; i < this.length; sum += this[i++]);
    return sum;
}

/// <summary>
/// Remove all items from array by value.
/// </summary>
Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) != -1) {
            this.splice(ax, 1);
        }
    }
    return this;
}

/// <summary>
/// Get object within array by value of property within object.
/// </summary>
Array.prototype.findByProperty = function (propertyName, value, safe) {
    for (var i = 0; i < this.length; i++) {
        if (this[i][propertyName] === value) {
            return this[i];
        }
    }

    if (safe) {
        return null;
    }
    throw "Couldn't find object with property \"" + propertyName + "\" having a value of \"" + value + "\".";
}

/// <summary>
/// Get ALL objects within array by value of property within object.
/// </summary>
Array.prototype.findAllByProperty = function (propertyName, value, safe) {
    var outputArray = [];
    for (var i = 0; i < this.length; i++) {
        if (this[i][propertyName] === value) {
            outputArray.push(this[i]);
        }
    }

    if (outputArray.length == 0 && !safe) {
        throw "Couldn't find any objects with property \"" + propertyName + "\" having a value of \"" + value + "\".";
    }
    return outputArray;

}

Array.prototype.getRandomElement = function () {
    return this[Math.floor(Math.random() * this.length)]
}
/// Split array into multidimensional array.
Array.prototype.chunk = function (chunkSize) {
    var array = this;
    return [].concat.apply([],
        array.map(function (elem, i) {
            return i % chunkSize ? [] : [array.slice(i, i + chunkSize)];
        })
    );
}

// Max value of numerical array.
Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

// Min value of numerical array.
Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

// jQuery functions.
if (jQuery != undefined) {
    (function ($j) {
        $j.fn.evalLinkJs = function () {
            $j(this)[0].attributes.href.nodeValue.evalLinkJs();
        }
    })(jQuery);
}

CanvasRenderingContext2D.prototype.centerText = function (text, minX, maxX, y) {
    var width = maxX - minX;
    var middle = minX + Math.floor(width / 2);
    var metrics = ctx.measureText(text);
    var textWidth = metrics.width;
    var centeredX = middle - Math.floor(textWidth / 2);
    ctx.fillText(text, centeredX, y);
}

// Canvas prototype functions.
CanvasRenderingContext2D.prototype.wrapText = function (text, x, y, maxWidth, lineHeight) {

    var lines = text.split("\\n");
    if (lines.length == 1) {
        lines = text.split("\n");
    }

    for (var i = 0; i < lines.length; i++) {

        var words = lines[i].split(' ');
        var line = '';

        for (var n = 0; n < words.length; n++) {
            var testLine = line + words[n] + ' ';
            var metrics = this.measureText(testLine);
            var testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                this.fillText(line, x, y);
                line = words[n] + ' ';
                y += lineHeight;
            }
            else {
                line = testLine;
            }
        }

        this.fillText(line, x, y);
        y += lineHeight;
    }
}