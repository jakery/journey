define('app', [], function () {
  let Coordinates = require("./Coordinates");

  function tileDistanceBetween(coords1, coords2) {
    const xDist = Math.abs(coords1.x - coords2.x);
    const yDist = Math.abs(coords1.y - coords2.y);
    return xDist + yDist;
  }

  function areColliding(pos1, pos2) {
    return pos1.x == pos2.x && pos1.y == pos2.y;
  }

  function areSpritesColliding(s1, s2) {
    return areColliding(s1.position, s2.position);
  }

  require("./jakesChallenge.js");
});
