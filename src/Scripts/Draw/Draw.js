define('Draw',
  [
    '../Constants/Constants',
    '../Coordinates',
    './DrawHelpers',
  ],
  (
    Constants,
    Coordinates,
    DrawHelpers
  ) => {
    function Draw(game, stage, player) {
      this.game = game;
      this.stage = stage;
      this.player = player;

      this.tilesAreCacheable = sign => !this.game.corruption && sign === 1;

      // Define default canvas parameters.
      this.ctx = this.stage.gameCanvas.getContext('2d');
      this.ctx.lineWidth = 1;
      this.ctx.font = '20px sans-serif';
      this.ctx.textBaseline = 'top';

      this.DrawHelpers = new DrawHelpers(this.ctx);

      this.generateGridLines = function generateGridLines() {
        const gridLines = [];

        for (let x = 0; x <= stage.width; x += Constants.baseUnit) {
          const coord = [x + 0.5, 0.5, x + 0.5, stage.height + 0.5];
          if (x === stage.width) {
            coord[0] -= 1;
            coord[2] -= 1;
          }
          gridLines.push(coord);
        }
        for (let y = 0; y <= stage.height; y += Constants.baseUnit) {
          const coord = [0.5, y + 0.5, stage.width + 0.5, y + 0.5];
          if (y === stage.height) coord[3] -= 1;
          gridLines.push(coord);
        }
        return gridLines;
      };

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
        const tileX = ((tileIndex + (game.corruption * sign))
          % game.map.tilesets[0].indexWidth)
          * Constants.baseUnit;
        const tileY = (Math.floor((tileIndex + (game.corruption * sign)) /
          game.map.tilesets[0].indexWidth))
          * Constants.baseUnit;
        const tileWidth = Constants.baseUnit;
        const tileHeight = Constants.baseUnit;

        return { tileX, tileY, tileWidth, tileHeight };
      };

      this.drawTileAbsolute = function drawTileAbsolute(tileNumber, coords, sign = 1) {
        // Tile number isn't valid. Probably a blank square on the map. Ignore.
        if (tileNumber < 1) {
          return;
        }
        // TODO: This is compeltely cacheable.
        const t = this.getTileCoordsFromImage(tileNumber, sign);
        this.ctx.drawImage(
          this.game.assets[game.map.parameters.tileset],
          t.tileX,
          t.tileY,
          t.tileWidth,
          t.tileHeight,
          coords.x,
          coords.y,
          Constants.baseUnit,
          Constants.baseUnit);
      };

      this.drawTilex = function drawTilex(tileNumber, c, sign = 1) {
        const TileCodes = Constants.tileCodes;
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

            if (coords.x > this.stage.playboxWidth - 32) {
              coords.x -= this.game.map.pixelWidth;
            }

          if (coords.y < 0) {
            coords.y += this.game.map.pixelHeight;
          } else if (coords.y > this.stage.playboxHeight - 32) {
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
          this.ctx.save();
          this.ctx.fillStyle = 'white';
          this.ctx.font = '12px Helvetica';

          const tollText = this.game.moneyCount - this.player.inventory.money;

          const offset = 16 - Math.floor(this.ctx.measureText(tollText).width / 2);
          this.ctx.fillText(tollText, coords.x + offset, coords.y + 12);

          this.ctx.restore();
        }
      };

      this.getTileDrawOffsetCoords = function getTileDrawOffsetCoords(coords) {
        const drawC = new Coordinates();
        drawC.x = (coords.x * Constants.baseUnit) + this.stage.drawOffset.x;
        drawC.y = (coords.y * Constants.baseUnit) + this.stage.drawOffset.y;
        return drawC;
      };

      this.beginDraw = function beginDraw() {
        const TileCodes = Constants.tileCodes;
        // Set stage offset to center on player.
        if (this.stage.isOffset) {
          this.stage.drawOffset = new Coordinates(
            (this.player.position.x * -32) + this.stage.halfBoxWidthLess16,
            (this.player.position.y * -32) + this.stage.halfBoxHeightLess16
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
            this.drawTilex(bgTileId, new Coordinates(c.x * 32, c.y * 32));
          }
        }

        // Draw map.

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
          const data = this.game.map.layers[0].data;

          let tileNumber = data[i];
          const coords = this.game.map.getCoordsByTileIndex(i); // TODO: Is this cacheable?
          const tileOffsetCoords = this.getTileDrawOffsetCoords(coords);

          // TODO: Refactor this check to be outside the for loop;
          //    reconstruct for loop based on starting position.
          // Don't process tiles that are out of bounds of the draw screen.
          if (!this.tileIsInDrawBounds(tileOffsetCoords) && this.game.map.parameters.wrapAround !== 'true') {
            continue;
          }

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

        // Draw items.
        for (let i = 0; i < this.game.items.length; i += 1) {
          this.game.items[i].draw();
        }

        // Draw tools.
        for (let i = 0; i < this.game.tools.length; i += 1) {
          this.game.tools[i].draw();
        }

        // Draw player.

        if (!this.game.atExit) {
          this.player.draw();
        }

        // Draw enemies.
        for (let i = 0; i < this.game.enemies.length; i += 1) {
          this.game.enemies[i].draw();
        }

        this.game.hud.draw();

        this.game.credits.draw();
      };

      this.drawTileOffset = function drawTileOffset(tileNumber, coords, sign) {
        // Tile number isn't valid. Probably a blank square on the map. Ignore.
        if (tileNumber < 1) {
          return;
        }
        const drawC = this.getTileDrawOffsetCoords(coords);
        this.drawTilex(tileNumber, drawC, sign);
      };
      this.drawCenterText = this.DrawHelpers.drawCenterText;
      this.drawWrappedText = this.DrawHelpers.drawWrappedText;
    return Draw;
  });
