define('Map', ['./Constants/Constants', './Coordinates'], (Constants, Coordinates) => function Map(map) {

  this.getTileIndexByCoords = function getTileIndexByCoords(x, y) {
    return (y * this.width) + x;
  };


  this.isInBounds = function isInBounds(coords) {
    return coords.x >= 0
      && coords.x < this.width
      && coords.y > 0
      && coords.y < this.height;
  };

  this.getCoordsByTileIndex = function getCoordsByTileIndex(i) {
    return new Coordinates(
      i % this.width,
      Math.floor(i / this.width)
    );
  };

  this.getTileTypeByCoords = function getTileTypeByCoords(x, y) {
    const arrayIndex = this.getTileIndexByCoords(x, y);
    return this.layers[0].data[arrayIndex];
  };

  this.changeTileType = function changeTileType(x, y, type) {
    const arrayIndex = this.getTileIndexByCoords(x, y);
    this.layers[0].data[arrayIndex] = type;
  };

  Object.assign(this, map);

  this.tileProperties = this.tilesets[0].tileproperties;

  // TODO: Refactor these.
  this.drawWidth = this.pixelWidth = this.width * Constants.baseUnit;
  this.drawHeight = this.pixelHeight = this.height * Constants.baseUnit;


  // TODO: Make this a function.
  for (let i = 0; i < this.tilesets.length; i += 1) {
    this.tilesets[i].indexWidth =
      this.tilesets[0].imagewidth / this.tilesets[0].tilewidth;
    this.tilesets[i].indexHeight =
      this.tilesets[0].imageheight / this.tilesets[0].tileheight;
  }

});
