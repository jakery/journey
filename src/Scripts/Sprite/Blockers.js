define('Blockers', ['../Constants/TileCodes'], TileCodes => ({
  wall: {
    test: destinationTileType =>
      destinationTileType !== TileCodes.wall
      && destinationTileType !== TileCodes.futureFloor,
    callback: () => false,
  },
  disappearingRedBlock: {
    test: (destinationTileType, game) =>
      destinationTileType !== TileCodes.dRedBlockInactive
      || game.redSwitch,
    callback: () => false,
  },
  appearingRedBlock: {
    test: (destinationTileType, game) =>
      destinationTileType !== TileCodes.aRedBlockInactive
      || !game.redSwitch,
    callback: () => false,
  },
  disappearingYellowBlock: {
    test: (destinationTileType, game) =>
      destinationTileType !== TileCodes.dYellowBlockInactive
      || game.yellowSwitch,
    callback: () => false,
  },
  appearingYellowBlock: {
    test: (destinationTileType, game) =>
      destinationTileType !== TileCodes.aYellowBlockInactive
      || !game.yellowSwitch,
    callback: () => false,
  },
  disappearingGreenBlock: {
    test: (destinationTileType, game) =>
      destinationTileType !== TileCodes.dGreenBlockInactive
      || game.greenSwitch,
    callback: () => false,
  },
  appearingGreenBlock: {
    test: (destinationTileType, game) =>
      destinationTileType !== TileCodes.aGreenBlockInactive
      || !game.greenSwitch,
    callback: () => false,
  },
  brownBlockTogglesOn: {
    test: (destinationTileType, game) =>
      destinationTileType !== TileCodes.brownBlockInactive || !game.brownSwitch,
    callback: () => false,
  },
  brownBlockTogglesOff: {
    test: (destinationTileType, game) =>
      destinationTileType !== TileCodes.brownBlockActive || game.brownSwitch,
    callback: () => false,
  },
  yellowDoor: {
    test: (destinationTileType, game, sprite) =>
      destinationTileType !== TileCodes.yellowDoor || sprite.inventory.yellowKeys > 0,
    callback: () => false,
  },
  redDoor: {
    test: (destinationTileType, game, sprite) =>
      destinationTileType !== TileCodes.redDoor || sprite.inventory.redKeys > 0,
    callback: () => false,
  },
  greenDoor: {
    test: (destinationTileType, game, sprite) =>
      destinationTileType !== TileCodes.greenDoor || sprite.inventory.greenKeys > 0,
    callback: () => false,
  },
  cyanDoor: {
    test: (destinationTileType, game, sprite) =>
      destinationTileType !== TileCodes.cyanDoor || sprite.inventory.cyanKeys > 0,
    callback: () => false,
  },
  toll: {
    test: (destinationTileType, game, sprite) => destinationTileType !== TileCodes.toll
      || sprite.inventory.money >= game.moneyCount,
    callback: () => false,
  },
}));
