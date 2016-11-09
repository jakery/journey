define('Map', ['./Constants/Constants', './Coordinates', './Utility', './ObscurelyNamedFile'], (Constants, Coordinates, Utility, PasswordHandler) => function Map(map, game, stage) {
  this.game = game;
  this.stage = stage;
  this.passwordHandler = new PasswordHandler();

  // Defaults. Will be overridden below if replacement parameters exist.
  this.parameters = {
    wrapAround: false,
    tileset: 'devgraphics',
  };

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

  this.setDrawDimensions = function setDrawDimensions() {
    // TODO: Rename all references to these.
    this.drawWidth = this.pixelWidth = this.width * Constants.baseUnit;
    this.drawHeight = this.pixelHeight = this.height * Constants.baseUnit;

    for (let i = 0; i < this.tilesets.length; i += 1) {
      this.tilesets[i].indexWidth =
        this.tilesets[0].imagewidth / this.tilesets[0].tilewidth;
      this.tilesets[i].indexHeight =
        this.tilesets[0].imageheight / this.tilesets[0].tileheight;
    }
  };

  this.setProperties = function setProperties() {
    // TODO: Refactor parameters. Make it freaking consistent.
    const parametersObject = Utility.array.findByProperty(this.layers, 'name', 'Parameters', true);

    if (parametersObject !== null && typeof parametersObject.properties !== 'undefined') {
      Object.assign(this.parameters, parametersObject.properties);
    }

    this.game.setProperties({
      mode: typeof this.parameters.mode !== 'undefined'
        ? Constants.gameModes[this.parameters.mode]
        : Constants.gameModes.normal,
      // TODO: Shouldn't this always be gotten from the passwordArray?
      password: typeof (this.parameters.password) !== 'undefined'
        ? this.game.password = this.parameters.password
        : this.passwordHandler.passwordArray[game.level],
      nextLevelNumber: typeof (this.parameters.nextLevel) !== 'undefined'
        ? this.parameters.nextLevel
        : this.game.level + 1,
      clock: typeof (this.parameters.time) !== 'undefined'
        ? parseInt(this.parameters.time, 10)
        : -1,
    });


    this.stage.setProperties({
      isOffset: !(typeof (this.parameters.stageOffset) !== 'undefined' && this.parameters.stageOffset === 'false'),
    });

    // TODO: Can this be removed?
    this.parameters.tileset = typeof (this.parameters.tileset) !== 'undefined'
      ? this.parameters.tileset
      : 'devgraphics'; // TODO: Remove magic string.
  };

  Object.assign(this, map);
  this.setDrawDimensions();

  this.tileProperties = this.tilesets[0].tileproperties;
});
