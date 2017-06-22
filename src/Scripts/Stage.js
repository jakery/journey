// Todo: Add code to create the <canvas> element in this file, removing dependency on plain HTML.
define('Stage', ['./Constants/RenderSettings', './Coordinates', './Helpers/Dom'],
  (RenderSettings, Coordinates, Dom) => function Stage() {
    this.isOffset = true;

    this.gameCanvas = document.getElementById('gameCanvas');
    if (this.gameCanvas === null) {
      this.gameCanvas = document.createElement('div');
      this.gameCanvas.setProperties({});
    }
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

    this.setProperties = function setProperties(obj) {
      Object.assign(this, obj);
    };

    // TODO: This is now part of map.js. Look for references to this version and swap them out.
    this.getCoordsByTileIndex = function getCoordsByTileIndex(i) {
      return new Coordinates(
        i % this.playboxTileWidth,
        Math.floor(i / this.playboxTileWidth)
      );
    };

    this.init = function init() {
      this.width = this.gameCanvasDom.width();
      this.height = this.gameCanvasDom.height();

      this.playboxWidth = this.playBlockWidth * RenderSettings.baseUnit;
      this.playboxHeight = this.playBlockHeight * RenderSettings.baseUnit;

      this.halfBoxWidthLess16 = (this.playboxWidth / 2) - (RenderSettings.baseUnit / 2);
      this.halfBoxHeightLess16 = (this.playboxHeight / 2);

      this.playboxTileWidth = this.playboxWidth / RenderSettings.baseUnit;
      this.playboxTileHeight = this.playboxHeight / RenderSettings.baseUnit;

      this.playboxTileCount = this.playboxTileWidth * this.playboxTileHeight;

      this.hudCoords = new Coordinates(this.playboxWidth, 0);
      this.hudWidth = this.width - this.playboxWidth;
      this.hudHeight = this.height;
    };
    this.init();
  });
