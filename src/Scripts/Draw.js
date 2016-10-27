define("Draw", [], () => {

  let d = function () { }

  this.drawTilex = function drawTilex(tileNumber, coords, sign) {
    // Tile number isn't valid. Probably a blank square on the map. Ignore.
    if (tileNumber < 1) {
      return;
    }

    if (sign === null || typeof (sign) === 'undefined') {
      sign = 1;
    }

    if (game.map.parameters.wrapAround === 'true') {
      // Wrap infinitely.
      if (coords.x < 0) {
        coords.x += game.map.pixelWidth;
      } else

        if (coords.x > stage.playboxWidth - 32) {
          coords.x -= game.map.pixelWidth;
        }

      if (coords.y < 0) {
        coords.y += game.map.pixelHeight;
      }

      else if (coords.y > stage.playboxHeight - 32) {
        coords.y -= game.map.pixelHeight;
      }
    }

    // If tile is outside visible bounds, don't process for drawing.
    if (!tileIsInDrawBounds(coords)) {
      return;
    }

    drawTileAbsolute(tileNumber, coords, sign);

    // Is toll tile.
    if (tileNumber === tileCodes.toll || tileNumber === tileCodes.tollGreen) {
      ctx.save();
      ctx.fillStyle = 'white';
      ctx.font = '12px Helvetica';

      const tollText = game.moneyCount - player.inventory.money;

      const offset = 16 - Math.floor(ctx.measureText(tollText).width / 2);
      ctx.fillText(tollText, coords.x + offset, coords.y + 12);

      ctx.restore();
    }
  }

  this.getTileDrawOffsetCoords = function getTileDrawOffsetCoords(coords) {
    const drawC = new Coordinates();
    drawC.x = (coords.x) * 32 + stage.drawOffset.x;
    drawC.y = (coords.y) * 32 + stage.drawOffset.y;
    return drawC;
  }

  function Draw(game, stage, player) {
    // Set stage offset to center on player.
    if (stage.isOffset) {
      stage.drawOffset = new Coordinates(
        (player.position.x * -32) + stage.halfBoxWidthLess16,
        (player.position.y * -32) + stage.halfBoxHeightLess16
      );
    } else {
      stage.drawOffset = new Coordinates(0, 0);
    }
    ctx.clearRect(0, 0, stage.width, stage.height);

    // Draw map tile background (unless map is wraparound).

    const bgTileId = (game.map.parameters.tileset === 'dungeon')
      ? tileCodes.futureWall
      : tileCodes.wall;
    if (game.map.parameters.wrapAround !== 'true') {
      for (let i = 0; i < stage.playboxTileCount; i += 1) {
        const c = stage.getCoordsByTileIndex(i);
        drawTilex(bgTileId, new Coordinates(c.x * 32, c.y * 32));
      }
    }

    // Draw map.

    // To prevent slowdown on larger maps, only loop through relevant portions of map relative to player position.

    let minY = 0;
    let maxY = game.map.layers[0].data.length;

    if (game.map.parameters.wrapAround !== 'true' && stage.isOffset) {
      minY = Math.max(game.map.width * (player.position.y - 6), minY);
      maxY = Math.min(game.map.width * (player.position.y + 6), maxY);
    }

    for (let i = minY; i < maxY; i += 1) {
      const data = game.map.layers[0].data;

      let tileNumber = data[i];
      const coords = game.map.getCoordsByTileIndex(i);
      const tileOffsetCoords = getTileDrawOffsetCoords(coords);

      // TODO: Refactor this check to be outside the for loop; reconstruct for loop based on starting position.
      // Don't process tiles that are out of bounds of the draw screen.
      if (!tileIsInDrawBounds(tileOffsetCoords) && game.map.parameters.wrapAround !== 'true') {
        continue;
      }

      // Check for special changes to block display.

      switch (tileNumber) {
        case tileCodes.floor:
        case tileCodes.wall:
          break;

        // Red disappearing tile.
        case (tileCodes.dRedBlockInactive):
          if (game.redSwitch) {
            tileNumber = tileCodes.dRedBlockActive;
          }
          break;

        // Red appearing tile.
        case (tileCodes.aRedBlockInactive):
          if (game.redSwitch) {
            tileNumber = tileCodes.aRedBlockActive;
          }
          break;

        // Yellow disappearing tile.
        case (tileCodes.dYellowBlockInactive):
          if (game.yellowSwitch) {
            tileNumber = tileCodes.dYellowBlockActive;
          }
          break;

        // Yellow appearing tile.
        case (tileCodes.aYellowBlockInactive):
          if (game.yellowSwitch) {
            tileNumber = tileCodes.aYellowBlockActive;
          }
          break;

        // Green disappearing tile.
        case (tileCodes.dGreenBlockInactive):
          if (game.greenSwitch) {
            tileNumber = tileCodes.dGreenBlockActive;
          }
          break;

        // Green appearing tile.
        case (tileCodes.aGreenBlockInactive):
          if (game.greenSwitch) {
            tileNumber = tileCodes.aGreenBlockActive;
          }
          break;

        case (tileCodes.brownBlockActive):
          if (game.brownSwitch) {
            tileNumber = tileCodes.brownBlockInactive;
          }
          break;

        case (tileCodes.brownBlockInactive):
          if (game.brownSwitch) {
            tileNumber = tileCodes.brownBlockActive;
          }
          break;

        case tileCodes.toll:
          // Toll collected? Green toll door.
          if (player.inventory.money >= game.moneyCount) {
            tileNumber = tileCodes.tollGreen;
          }
          break;

        // Don't draw hidden switches when out of debug mode.
        case tileCodes.hiddenSwitch:
          if (!game.debug) {
            continue;
          }
          break;
        default: break;
      }

      drawTilex(tileNumber, tileOffsetCoords);
    }

    // Draw items.
    for (let i = 0; i < game.items.length; i += 1) {
      game.items[i].Draw();
    }

    // Draw tools.
    for (let i = 0; i < game.tools.length; i += 1) {
      game.tools[i].Draw();
    }

    // Draw player.

    if (!game.atExit) {
      player.Draw();
    }

    // Draw enemies.
    for (let i = 0; i < game.enemies.length; i += 1) {
      game.enemies[i].Draw();
    }

    game.hud.Draw();

    game.credits.Draw();
  }


  this.drawTileOffset = function (tileNumber, coords, sign) {
    // Tile number isn't valid. Probably a blank square on the map. Ignore.
    if (tileNumber < 1) {
      return;
    }
    const drawC = this.getTileDrawOffsetCoords(coords);
    this.drawTilex(tileNumber, drawC, sign);
  };


  return new Draw();
});
