define('Orientation', [], {
  enums: {
    up: 0,
    right: 1,
    down: 2,
    left: 3,
  },
  behind: direction => (direction + 2) % 4,
  antiClockwise: direction => (direction + 3) % 4,
  proClockwise: direction => (direction + 1) % 4,
});
