define('Constants', ['./TileCodes'], TileCodes => ({
  tileCodes: TileCodes,
  gameModes: {
    title: 0,
    password: 1,
    normal: 2,
    credits: 3,
  },
  directions: {
    up: 0,
    right: 1,
    down: 2,
    left: 3,
  },
}));
