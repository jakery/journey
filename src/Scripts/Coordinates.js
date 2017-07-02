define('Coordinates', [], () => {
  function Coordinates(px, py) {
    this.x = null;
    this.y = null;
    if (isFinite(px)) {
      this.x = px;
    }
    if (isFinite(py)) {
      this.y = py;
    }
  }
  Coordinates.prototype.constructor = Coordinates;
  return Coordinates;
});

