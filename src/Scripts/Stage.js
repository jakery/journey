define('Stage', ['./Constants/Constants', './Coordinates', './Helpers/Dom'], (Constants, Coordinates, Dom) => function Stage() {
  this.isOffset = true;

  this.gameCanvas = document.getElementById('gameCanvas');
  this.gameCanvasDom = new Dom(this.gameCanvas);
  this.width = null;
  this.height = null;
  this.playBlockWidth = 15;
  this.playboxWidth = null;
  this.playBlockHeight = 12;
  this.playboxHeight = null;
  this.playboxX = 0;
  this.playboxY = 0;
  this.hudCoords = {};
  this.hudWidth = null;
  this.hudHeight = null;

  this.playboxTileWidth = null;
  this.playboxTileHeight = null;

  this.drawOffset = null;
  this.halfBoxWidthLess16 = null;
  this.halfBoxHeightLess16 = null;
  this.playboxTileCount = null;
  this.init = function init() {
    this.width = this.gameCanvasDom.width();
    this.height = this.gameCanvasDom.height();

    this.playboxWidth = this.playBlockWidth * Constants.baseUnit;
    this.playboxHeight = this.playBlockHeight * Constants.baseUnit;

    this.halfBoxWidthLess16 = (this.playboxWidth / 2) - (Constants.baseUnit / 2);
    this.halfBoxHeightLess16 = (this.playboxHeight / 2);

    this.playboxTileWidth = this.playboxWidth / Constants.baseUnit;
    this.playboxTileHeight = this.playboxHeight / Constants.baseUnit;

    this.playboxTileCount = this.playboxTileWidth * this.playboxTileHeight;

    this.hudCoords = new Coordinates(this.playboxWidth, 0);
    this.hudWidth = this.width - this.playboxWidth;
    this.hudHeight = this.height;
  };

  // TODO: Move this to a utility/draw module.
  this.getCoordsByTileIndex = function getCoordsByTileIndex(i) {
    return new Coordinates(
      i % this.playboxTileWidth,
      Math.floor(i / this.playboxTileWidth)
    );
  };
});
