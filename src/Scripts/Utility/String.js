define('String', [], () => function String() {
  const currencyPattern = /,|$/g;

  // Convert currency string to float.
  this.parseFloatCurrency = function parseFloatCurrency() {
    return parseFloat(this.replace(currencyPattern, ''));
  };

  // Convert currency string to integer.
  this.parseIntCurrency = function parseIntCurrency(radix = 10) {
    // Default to Base-10.
    return parseInt(this.replace(currencyPattern, ''), radix);
  };

  // Convert number to formatted currency string.
  this.formatCurrency = function formatCurrency(n) {
    let number = n;
    number = number.toString().replace(currencyPattern, '');
    if (isNaN(number)) { number = '0'; }
    const sign = (number !== (number = Math.abs(number)));
    number = Math.floor((number * 100) + 0.50000000001);
    let cents = number % 100;
    number = Math.floor(number / 100).toString();
    if (cents < 10) { cents = `0${cents}`; }
    for (let i = 0; i < Math.floor((number.length - (1 + i)) / 3); i += 1) {
      number = `${number.substring(0, number.length - ((4 * i) + 3))},${
        number.substring(number.length - ((4 * i) + 3))}`;
    }
    return (`${(sign) ? '' : '-'}$${number}.${cents}`);
  };

  // Trim whitespace from string.
  this.trim = function trim(string) {
    return string.replace(/^\s+|\s+$/g, '');
  };
  this.ltrim = function ltrim(string) {
    return string.replace(/^\s+/, '');
  };
  this.rtrim = function rtrim(string) {
    return string.replace(/\s+$/, '');
  };


  this.getFileNameOnly = function getFileNameOnly(filePath) {
    return filePath.split('/').pop().split('.').shift();
  };

  this.getFileExtensionOnly = function getFileExtensionOnly(filePath) {
    return filePath.split('/').pop().split('.').pop();
  };
});
