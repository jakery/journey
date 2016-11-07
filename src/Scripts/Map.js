define('Map', ['./Constants/Constants', './Coordinates'], (Constants, Coordinates) => function Map(masterGame) {
  this.width = masterGame.map.width;
  this.height = masterGame.map.height;

  this.getTileIndexByCoords = function getTileIndexByCoords(x, y) {
    return (y * this.width) + x;
  };

  this.getMultiDimensionalMap = function getMultiDimensionalMap(originalArray, width) {
    const mdMap = [];
    for (let i = 0; i < originalArray.length; i += width) {
      const smallarray = originalArray.slice(i, i + width);
      mdMap.push(smallarray);
    }
    return mdMap;
  };

  this.isInBounds = function isInBounds(coords) {
    return coords.x >= 0
      && coords.x < this.width
      && coords.y > 0
      && coords.y < this.height;
  };

  // Temporary function to lessen pain during the refactor.
  this.wireUp = function wireUp(g) {
    const game = g;
    game.map.tileProperties = game.map.tilesets[0].tileproperties;

    game.map.getTileIndexByCoords = (x, y) => this.getTileIndexByCoords(x, y);

    game.map.getTileTypeByCoords = function getTileTypeByCoords(x, y) {
      const arrayIndex = this.getTileIndexByCoords(x, y);
      return this.layers[0].data[arrayIndex];
    };

    game.map.getCoordsByTileIndex = function getCoordsByTileIndex(i) {
      return new Coordinates(
        i % game.map.width,
        Math.floor(i / game.map.width)
      );
    };

    game.map.changeTileType = function changeTileType(x, y, type) {
      const arrayIndex = this.getTileIndexByCoords(x, y);
      game.map.layers[0].data[arrayIndex] = type;
    };

    game.map.isInBounds = coords => this.isInBounds(coords);

    // TODO: Make this a function.
    for (let i = 0; i < game.map.tilesets.length; i += 1) {
      game.map.tilesets[i].indexWidth =
        game.map.tilesets[0].imagewidth / game.map.tilesets[0].tilewidth;
      game.map.tilesets[i].indexHeight =
        game.map.tilesets[0].imageheight / game.map.tilesets[0].tileheight;
    }

    // TODO: Refactor these.
    game.map.mdMap = this.getMultiDimensionalMap(game.map.layers[0].data, game.map.width);

    game.map.pixelWidth = game.map.width * Constants.baseUnit;
    game.map.pixelHeight = game.map.height * Constants.baseUnit;
  };
});
