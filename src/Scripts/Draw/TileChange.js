const TileCodes = require('../Constants/TileCodes');

define('TileChange', [], () => {
  const TileChange = function TileChange(game) {
    this.game = game;
    this.check = function check(tileNumber) {
      if (tileNumber === TileCodes.floor || tileNumber === TileCodes.wall) {
        return tileNumber;
      }

      // Red disappearing tile.
      if (tileNumber === TileCodes.dRedBlockInactive && this.game.redSwitch) {
        return TileCodes.dRedBlockActive;
      }

      // Red appearing tile.
      if (tileNumber === TileCodes.aRedBlockInactive && this.game.redSwitch) {
        return TileCodes.aRedBlockActive;
      }

      // Yellow disappearing tile.
      if (tileNumber === TileCodes.dYellowBlockInactive && this.game.yellowSwitch) {
        return TileCodes.dYellowBlockActive;
      }

      // Yellow appearing tile.
      if (tileNumber === TileCodes.aYellowBlockInactive && this.game.yellowSwitch) {
        return TileCodes.aYellowBlockActive;
      }

      // Green disappearing tile.
      if (tileNumber === TileCodes.dGreenBlockInactive && this.game.greenSwitch) {
        return TileCodes.dGreenBlockActive;
      }

      // Green appearing tile.
      if (tileNumber === TileCodes.aGreenBlockInactive && this.game.greenSwitch) {
        return TileCodes.aGreenBlockActive;
      }

      if (tileNumber === TileCodes.brownBlockActive && this.game.brownSwitch) {
        return TileCodes.brownBlockInactive;
      }


      if (tileNumber === TileCodes.brownBlockInactive && this.game.brownSwitch) {
        return TileCodes.brownBlockActive;
      }

      if (tileNumber === TileCodes.toll && this.game.player.inventory.money >= this.game.moneyCount) {
        // Toll collected? Green toll door.
        return TileCodes.tollGreen;
      }

      // Don't draw hidden switches when out of debug mode.
      if (tileNumber === TileCodes.hiddenSwitch && !this.game.debug) {
        return TileCodes.nothing;
      }

      return tileNumber;
    };
  };
  return TileChange;
});
