// TODO: Check for items to decouple
const RenderSettings = require('../Constants/RenderSettings');
const TileCodes = require('../Constants/TileCodes');
const Coordinates = require('../Coordinates');
const DrawHelpers = require('./DrawHelpers');

define('Draw', [], () => function Draw(game = null, stage = null, player = null) {
  const baseUnit = RenderSettings.baseUnit;
  const halfBaseUnit = baseUnit / 2;
  this.game = game;
  this.stage = stage;
  this.player = player;

  if (this.stage === null || !this.stage.gameCanvas) {
    throw new Error('Stage or Canvas object not available.');
  }

  this.tilesAreCacheable = sign => !this.game.corruption && sign === 1;

  // Define default canvas parameters.
  this.ctx = this.stage.gameCanvas.getContext('2d');
  this.ctx.lineWidth = 1;
  this.ctx.font = '20px sans-serif';
  this.ctx.textBaseline = 'top';

  this.DrawHelpers = new DrawHelpers(this.ctx);
  this.drawCenterText = this.DrawHelpers.drawCenterText;
  this.drawWrappedText = this.DrawHelpers.drawWrappedText;
  this.generateGridLines = this.DrawHelpers.generateGridLines.bind(this, stage);

  this.tileIsInDrawBounds = function tileIsInDrawBounds(coords) {
    return !(coords.x < 0 ||
      coords.x > this.stage.playboxWidth ||
      coords.y < 0 ||
      coords.y > this.stage.playboxHeight
    );
  };

  // TODO: Refactor this as an object.
  this.getTileCoordsFromImage = function getTileCoordsFromImage(tileNumber, sign = 1) {
    const tileIndex = tileNumber - 1;
    const tileSet = game.map.tilesets[0];
    const tileX = ((tileIndex + (game.corruption * sign))
      % tileSet.indexWidth)
      * RenderSettings.baseUnit;
    const tileY = (Math.floor((tileIndex + (game.corruption * sign)) /
      tileSet.indexWidth))
      * RenderSettings.baseUnit;
    const tileWidth = RenderSettings.baseUnit;
    const tileHeight = RenderSettings.baseUnit;

    return { tileX, tileY, tileWidth, tileHeight };
  };

  this.offsetAndDrawTile = function offsetAndDrawTile(tileNumber, coords, sign) {
    // Tile number isn't valid. Probably a blank square on the map. Ignore.
    if (tileNumber < 1) {
      return;
    }
    const drawC = this.getTileDrawOffsetCoords(coords);
    this.drawTilex(tileNumber, drawC, sign);
  };
  this.drawTileOffset = this.offsetAndDrawTile;

  this.drawTileAbsolute = function drawTileAbsolute(tileNumber, coords, sign = 1) {
    // Tile number isn't valid. Probably a blank square on the map. Ignore.
    if (tileNumber < 1) {
      return;
    }
    // TODO: This is compeltely cacheable.
    // TODO: Precalculate all coordinates for the tiles from the source tilemap.
    const t = this.getTileCoordsFromImage(tileNumber, sign);

    this.ctx.drawImage(
      this.game.assets[game.map.parameters.tileset],
      // Source image slice.
      t.tileX,
      t.tileY,
      t.tileWidth,
      t.tileHeight,

      // Canvas destination and size.
      coords.x,
      coords.y,
      RenderSettings.baseUnit,
      RenderSettings.baseUnit);
  };

  this.drawTilex = function drawTilex(tileNumber, c, sign = 1) {
    const coords = c;
    // Tile number isn't valid. Probably a blank square on the map. Ignore.
    if (tileNumber < 1) {
      return;
    }
    if (this.game.map.parameters.wrapAround === 'true') {
      // Wrap infinitely.
      if (coords.x < 0) {
        coords.x += this.game.map.pixelWidth;
      } else

        if (coords.x > this.stage.playboxWidth - baseUnit) {
          coords.x -= this.game.map.pixelWidth;
        }

      if (coords.y < 0) {
        coords.y += this.game.map.pixelHeight;
      } else if (coords.y > this.stage.playboxHeight - baseUnit) {
        coords.y -= this.game.map.pixelHeight;
      }
    }

    // If tile is outside visible bounds, don't process for drawing.
    if (!this.tileIsInDrawBounds(coords)) {
      return;
    }

    this.drawTileAbsolute(tileNumber, coords, sign);

    // Is toll tile.
    if (tileNumber === TileCodes.toll || tileNumber === TileCodes.tollGreen) {
      this.drawTollText(coords);
    }
  };

  this.drawTollText = function drawTollText(coords) {
    this.ctx.save();
    this.ctx.fillStyle = 'white';
    this.ctx.font = '12px Helvetica';

    const tollText = this.game.moneyCount - this.player.inventory.money;

    const offset = halfBaseUnit - Math.floor(this.ctx.measureText(tollText).width / 2);
    this.ctx.fillText(tollText, coords.x + offset, coords.y + 12);

    this.ctx.restore();
  };

  this.getTileDrawOffsetCoords = function getTileDrawOffsetCoords(coords) {
    const drawC = new Coordinates();
    drawC.x = (coords.x * RenderSettings.baseUnit) + this.stage.drawOffset.x;
    drawC.y = (coords.y * RenderSettings.baseUnit) + this.stage.drawOffset.y;
    return drawC;
  };

  this.beginDraw = function beginDraw() {
    // Set stage offset to center on player.
    if (this.stage.isOffset) {
      this.stage.drawOffset = new Coordinates(
        (this.player.position.x * -baseUnit) + this.stage.halfBoxWidthLess16,
        (this.player.position.y * -baseUnit) + this.stage.halfBoxHeightLess16
      );
    } else {
      this.stage.drawOffset = new Coordinates(0, 0);
    }
    this.ctx.clearRect(0, 0, this.stage.width, this.stage.height);

    // Draw map tile background (unless map is wraparound).

    const bgTileId = (this.game.map.parameters.tileset === 'dungeon')
      ? TileCodes.futureWall
      : TileCodes.wall;
    if (this.game.map.parameters.wrapAround !== 'true') {
      for (let i = 0; i < this.stage.playboxTileCount; i += 1) {
        const c = this.stage.getCoordsByTileIndex(i);
        this.drawTilex(bgTileId, new Coordinates(c.x * baseUnit, c.y * baseUnit));
      }
    }

    this.drawMap();

    // Draw items.
    for (let i = 0; i < this.game.items.length; i += 1) {
      this.game.items[i].draw();
    }

    this.game.items.forEach(item => item.draw());
    this.game.tools.forEach(tool => tool.draw());

    if (!this.game.atExit) {
      this.player.draw();
    }

    this.game.enemies.forEach(enemies => enemies.draw());
    this.game.hud.draw();
    this.game.credits.draw();
  };

  this.drawMap = function drawMap() {
    // To prevent slowdown on larger maps,
    //    only loop through relevant portions of map relative to player position.
    let minY = 0;
    let maxY = this.game.map.layers[0].data.length;
    const onlyDrawVisibleMap = this.game.map.parameters.wrapAround !== 'true' && this.stage.isOffset;
    if (onlyDrawVisibleMap) {
      minY = Math.max(this.game.map.width * (this.player.position.y - 6), minY);
      maxY = Math.min(this.game.map.width * (this.player.position.y + 6), maxY);
    }

    for (let i = minY; i < maxY; i += 1) {
      const coords = this.game.map.getCoordsByTileIndex(i);
      const tileOffsetCoords = this.getTileDrawOffsetCoords(coords);

      const tileIsOnscreen = !(!this.tileIsInDrawBounds(tileOffsetCoords) && this.game.map.parameters.wrapAround !== 'true');
      if (tileIsOnscreen) {
        const data = this.game.map.layers[0].data;

        let tileNumber = data[i];
        // Check for special changes to block display.

        switch (tileNumber) {
          case TileCodes.floor:
          case TileCodes.wall:
            break;

          // Red disappearing tile.
          case (TileCodes.dRedBlockInactive):
            if (this.game.redSwitch) {
              tileNumber = TileCodes.dRedBlockActive;
            }
            break;

          // Red appearing tile.
          case (TileCodes.aRedBlockInactive):
            if (this.game.redSwitch) {
              tileNumber = TileCodes.aRedBlockActive;
            }
            break;

          // Yellow disappearing tile.
          case (TileCodes.dYellowBlockInactive):
            if (this.game.yellowSwitch) {
              tileNumber = TileCodes.dYellowBlockActive;
            }
            break;

          // Yellow appearing tile.
          case (TileCodes.aYellowBlockInactive):
            if (this.game.yellowSwitch) {
              tileNumber = TileCodes.aYellowBlockActive;
            }
            break;

          // Green disappearing tile.
          case (TileCodes.dGreenBlockInactive):
            if (this.game.greenSwitch) {
              tileNumber = TileCodes.dGreenBlockActive;
            }
            break;

          // Green appearing tile.
          case (TileCodes.aGreenBlockInactive):
            if (this.game.greenSwitch) {
              tileNumber = TileCodes.aGreenBlockActive;
            }
            break;

          case (TileCodes.brownBlockActive):
            if (this.game.brownSwitch) {
              tileNumber = TileCodes.brownBlockInactive;
            }
            break;

          case (TileCodes.brownBlockInactive):
            if (this.game.brownSwitch) {
              tileNumber = TileCodes.brownBlockActive;
            }
            break;

          case TileCodes.toll:
            // Toll collected? Green toll door.
            if (this.player.inventory.money >= this.game.moneyCount) {
              tileNumber = TileCodes.tollGreen;
            }
            break;

          // Don't draw hidden switches when out of debug mode.
          case TileCodes.hiddenSwitch:
            if (!this.game.debug) {
              tileNumber = TileCodes.nothing;
            }
            break;
          default: break;
        }

        this.drawTilex(tileNumber, tileOffsetCoords);
      }
    }
  };
});
