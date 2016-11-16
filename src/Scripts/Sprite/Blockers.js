define('Blockers', ['../Constants/TileCodes'], TileCodes => ({
  wall: {
    test: destinationTileType => destinationTileType === TileCodes.wall,
    callback: () => false,
  },
}));
