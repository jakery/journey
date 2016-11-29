define('Array', [], () => function Array() {
  // Return sum of all numbers in array.
  // TODO: Unit test this.
  this.sum = function sum(array) {
    let output = 0;
    for (let i = 0; i < array.length; output += array[i += 1]);
    return output;
  };

  // / <summary>
  // / Remove all items from array by value.
  // / </summary>
  // TODO: Unit test this.
  this.remove = function remove(array, ...objectsToRemove) {
    if (typeof array === 'undefined') throw new Error('No array was provided.');
    const badObjects = [...objectsToRemove];
    if (!badObjects.length) { return this; }
    let badObject;
    let countOfBadObjects = badObjects.length;
    let highestIndexOfBadObject;
    while (countOfBadObjects && array.length) {
      countOfBadObjects -= 1;
      badObject = badObjects[countOfBadObjects];
      highestIndexOfBadObject = array.indexOf(badObject);
      while (highestIndexOfBadObject !== -1) {
        array.splice(highestIndexOfBadObject, 1);
        highestIndexOfBadObject = array.indexOf(badObject);
      }
    }
    return this;
  };

  this.getAllIndexes = function getAllIndexes(inputArray, searchValue) {
    const indexes = [];
    let i;
    for (i = 0; i < inputArray.length; i += 1) {
      if (inputArray[i] === searchValue) {
        indexes.push(i);
      }
    } return indexes;
  };

  // / <summary>
  // / Get object within array by value of property within object.
  // / </summary>
  this.findByProperty = function findByProperty(array, propertyName, value, safe) {
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
  this.findAllByProperty = function findAllByProperty(array, propertyName, value, safe) {
    const outputArray = [];
    for (let i = 0; i < array.length; i += 1) {
      if (array[i][propertyName] === value) {
        outputArray.push(array[i]);
      }
    }

    if (!outputArray.length && !safe) {
      throw new Error(`Couldn't find any objects with property "${propertyName}" having a value of "${value}".`);
    }
    return outputArray;
  };


  this.removeBySpriteId = function removeBySpriteId(array, id, safe) {
    if (typeof array === 'undefined') throw new Error('No array was provided.');
    return this.remove(array, this.findByProperty(array, 'spriteID', id, safe));
  };

  this.getRandomElement = function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  };
  // Split array into multidimensional array.
  this.chunk = function chunk(array, chunkSize) {
    const outputArray = [];
    return outputArray.concat.apply([],
      array.map((elem, i) => (i % chunkSize ? [] : [array.slice(i, i + chunkSize)]))
    );
  };

  // Max value of numerical array.
  this.max = function max(array) {
    return Math.max.apply(null, array);
  };

  // Min value of numerical array.
  this.min = function min(array) {
    return Math.min.apply(null, array);
  };
});
