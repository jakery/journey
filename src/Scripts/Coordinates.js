define('Coordinates', [], () => {
  return function (px, py) {
    this.x = null;
    this.y = null;
    if (isFinite(px)) {
      this.x = px;
    }
    if (isFinite(py)) {
      this.y = py;
    }
  };
});
