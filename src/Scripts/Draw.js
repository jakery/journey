define('Draw', ['./Coordinates', './TileCodes'], (Coordinates, TileCodes) => {
  const Draw = function (game, stage, player) {
    this.game = game;
    this.stage = stage;
    this.player = player;

    // Define default canvas parameters.
    this.ctx = this.stage.gameCanvas.getContext('2d');
    this.ctx.lineWidth = 1;
    this.ctx.font = '20px sans-serif';
    this.ctx.textBaseline = 'top';

    this.tileIsInDrawBounds = function tileIsInDrawBounds(coords) {
      return !(coords.x < 0 || coords.x > this.stage.playboxWidth || coords.y < 0 || coords.y > this.stage.playboxHeight);
    };

    this.getTileCoordsFromImage = function getTileCoordsFromImage(tileNumber, sign = 1) {
      const tileIndex = tileNumber - 1;
      const sx = ((tileIndex + (game.corruption * sign)) % game.map.tilesets[0].indexWidth) * 32;
      const sy = (Math.floor((tileIndex + (game.corruption * sign)) / game.map.tilesets[0].indexWidth)) * 32;
      const swidth = 32;
      const sheight = 32;

      return { sx, sy, swidth, sheight };
    };

    this.drawTileAbsolute = function drawTileAbsolute(tileNumber, coords, sign = 1) {
      // Tile number isn't valid. Probably a blank square on the map. Ignore.
      if (tileNumber < 1) {
        return;
      }
      const t = this.getTileCoordsFromImage(tileNumber, sign);
      this.ctx.drawImage(this.game.assets[game.map.parameters.tileset], t.sx, t.sy, t.swidth, t.sheight, coords.x, coords.y, 32, 32);
    };

    this.drawTilex = function drawTilex(tileNumber, coords, sign = 1) {
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
        }

        else if (coords.y > this.stage.playboxHeight - 32) {
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
      drawC.x = (coords.x) * 32 + this.stage.drawOffset.x;
      drawC.y = (coords.y) * 32 + this.stage.drawOffset.y;
      return drawC;
    };

    this.beginDraw = function beginDraw() {
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

      // To prevent slowdown on larger maps, only loop through relevant portions of map relative to player position.

      let minY = 0;
      let maxY = this.game.map.layers[0].data.length;

      if (this.game.map.parameters.wrapAround !== 'true' && this.stage.isOffset) {
        minY = Math.max(this.game.map.width * (this.player.position.y - 6), minY);
        maxY = Math.min(this.game.map.width * (this.player.position.y + 6), maxY);
      }

      for (let i = minY; i < maxY; i += 1) {
        const data = this.game.map.layers[0].data;

        let tileNumber = data[i];
        const coords = this.game.map.getCoordsByTileIndex(i); // TODO: Is this cacheable?
        const tileOffsetCoords = this.getTileDrawOffsetCoords(coords);

        // TODO: Refactor this check to be outside the for loop; reconstruct for loop based on starting position.
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
              continue;
            }
            break;
          default: break;
        }

        this.drawTilex(tileNumber, tileOffsetCoords);
      }

      // Draw items.
      for (let i = 0; i < this.game.items.length; i += 1) {
        this.game.items[i].Draw();
      }

      // Draw tools.
      for (let i = 0; i < this.game.tools.length; i += 1) {
        this.game.tools[i].Draw();
      }

      // Draw player.

      if (!this.game.atExit) {
        this.player.Draw();
      }

      // Draw enemies.
      for (let i = 0; i < this.game.enemies.length; i += 1) {
        this.game.enemies[i].Draw();
      }

      this.game.hud.Draw();

      this.game.credits.Draw();
    };

    this.drawTileOffset = function (tileNumber, coords, sign) {
      // Tile number isn't valid. Probably a blank square on the map. Ignore.
      if (tileNumber < 1) {
        return;
      }
      const drawC = this.getTileDrawOffsetCoords(coords);
      this.drawTilex(tileNumber, drawC, sign);
    };

    this.drawCenterText = function centerText(text, minX, maxX, y) {
      const width = maxX - minX;
      const middle = minX + Math.floor(width / 2);
      const metrics = this.ctx.measureText(text);
      const textWidth = metrics.width;
      const centeredX = middle - Math.floor(textWidth / 2);
      this.ctx.fillText(text, centeredX, y);
    };

    // Canvas prototype functions.
    this.drawWrappedText = function drawWrappedText(text, x, y, maxWidth, lineHeight) {
      let yAdjusted = y;
      let lines = text.split('\\n');
      if (lines.length === 1) {
        lines = text.split('\n');
      }

      for (let i = 0; i < lines.length; i += 1) {
        const words = lines[i].split(' ');
        let line = '';

        for (let n = 0; n < words.length; n += 1) {
          const testLine = `${line + words[n]} `;
          const metrics = this.ctx.measureText(testLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            this.ctx.fillText(line, x, yAdjusted);
            line = `${words[n]} `;
            yAdjusted += lineHeight;
          } else {
            line = testLine;
          }
        }
        this.ctx.fillText(line, x, yAdjusted);
        yAdjusted += lineHeight;
      }
    };
  };
  return Draw;
});
