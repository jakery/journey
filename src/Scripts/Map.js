define('Map', [], () => function Map(game) {
  this.width = game.map.width;
  this.height = game.map.height;

  this.isInBounds = function isInBounds(coords) {
    return coords.x >= 0
      && coords.x < this.width
      && coords.y > 0
      && coords.y < this.height;
  };
});
