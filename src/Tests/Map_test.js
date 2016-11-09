let Map = require('../Scripts/Map');
describe('Map', function () {
  let map;
  beforeEach(function () {
    map = new Map({
      width: 5,
      height: 5,
      layers: [
        {
          data: [
            50, 2, 2, 3, 5,
            5, 6, 2, 2, 10,
            2, 2, 2, 13, 14,
            15, 1, 1, 1, 1,
            1, 21, 22, 23, 2
          ]
        }
      ],
      tilesets: [{
        "firstgid": 1,
        "image": "..\/..\/..\/Content\/JakesChallenge\/devgraphics.png",
        "imageheight": 288,
        "imagewidth": 192,
        "margin": 0,
        "name": "devgraphics",
        "properties":
        {

        },
        "spacing": 0,
        "tileheight": 32,
        "tileproperties":
        {
          "0":
          {
            "type": "floor"
          },
          "1":
          {
            "type": "wall"
          },
          "10":
          {
            "type": "player2"
          },
          "11":
          {
            "type": "money"
          },
          "12":
          {
            "type": "toll"
          },
          "13":
          {
            "type": "toll2"
          },
          "14":
          {
            "type": "pushBlock"
          },
          "15":
          {
            "color": "red",
            "type": "switch"
          },
          "16":
          {
            "color": "red",
            "type": "disappearingWall"
          },
          "18":
          {
            "": ""
          },
          "19":
          {
            "type": "water"
          },
          "2":
          {
            "type": "yellowDoor"
          },
          "20":
          {
            "type": "redDoor"
          },
          "21":
          {
            "color": "red",
            "type": "redKey"
          },
          "22":
          {
            "color": "red",
            "type": "appearingWall"
          },
          "23":
          {
            "type": "redAppearingBlock2"
          },
          "24":
          {
            "type": "britishNascar"
          },
          "25":
          {
            "type": "hiddenSwitch"
          },
          "26":
          {
            "type": "gronpree"
          },
          "27":
          {
            "color": "yellow",
            "type": "switch"
          },
          "28":
          {
            "color": "yellow",
            "type": "disappearingWall"
          },
          "3":
          {
            "type": "yellowKey"
          },
          "30":
          {
            "type": "constructionButton"
          },
          "31":
          {
            "type": "help2"
          },
          "32":
          {
            "type": "cyanDoor"
          },
          "33":
          {
            "type": "cyanKey"
          },
          "34":
          {
            "color": "yellow",
            "type": "appearingWall"
          },
          "36":
          {
            "type": "teleporter"
          },
          "39":
          {
            "color": "green",
            "type": "switch"
          },
          "4":
          {
            "type": "start"
          },
          "40":
          {
            "color": "green",
            "type": "disappearingWall"
          },
          "42":
          {
            "type": "outTeleporter"
          },
          "43":
          {
            "type": "smartPredator"
          },
          "44":
          {
            "type": "greenDoor"
          },
          "45":
          {
            "color": "green",
            "type": "greenKey"
          },
          "46":
          {
            "color": "green",
            "type": "appearingWall"
          },
          "48":
          {
            "type": "futureWall"
          },
          "49":
          {
            "type": "futureFloor"
          },
          "5":
          {
            "type": "exit"
          },
          "50":
          {
            "color": "brownOff",
            "type": "switch"
          },
          "51":
          {
            "color": "brown",
            "type": "switch"
          },
          "6":
          {
            "type": "nascar"
          },
          "7":
          {
            "type": "help"
          },
          "8":
          {
            "type": "ball"
          },
          "9":
          {
            "type": "predator"
          }
        },
        "tilewidth": 32
      }]
    });
  });
  describe('getTileIndexByCoords()', function () {
    it('should return one dimensional index of coordinate.', function () {
      assert.equal(map.getTileIndexByCoords(0, 0), 0);
      assert.equal(map.getTileIndexByCoords(1, 0), 1);
      assert.equal(map.getTileIndexByCoords(2, 0), 2);
      assert.equal(map.getTileIndexByCoords(3, 0), 3);
      assert.equal(map.getTileIndexByCoords(0, 1), 5);
      assert.equal(map.getTileIndexByCoords(1, 1), 6);
      assert.equal(map.getTileIndexByCoords(4, 4), 24);
    });
  });

  describe('getTileTypeByCoords()', function () {
    it('should return value in data array corresponding to one-dimensional conversion.', function () {
      assert.equal(map.getTileTypeByCoords(2, 4), 22);
    });
  });

  describe('getCoordsByTileIndex()', function () {

    it('should return 2d coordinates converted from array index', function () {
      assert.deepEqual(map.getCoordsByTileIndex(0), { x: 0, y: 0 });
      assert.deepEqual(map.getCoordsByTileIndex(13), { x: 3, y: 2 });
      assert.deepEqual(map.getCoordsByTileIndex(24), { x: 4, y: 4 });
    });
  });

  describe('changeTileType()', function () {
    it('should change the value of map.layers[0].data[0] to 20.', function () {
      assert.equal(map.layers[0].data[0], 50);
      map.changeTileType(0, 0, 20);
      assert.equal(map.layers[0].data[0], 20);
    });
    it('should change the value of map.layers[0].data[21] to 0.', function () {
      assert.equal(map.layers[0].data[21], 21);
      map.changeTileType(1, 4, 0);
      assert.equal(map.layers[0].data[21], 0);
    });
  });
  describe('isInBounds()', function () {
    it('should return true', function () {
      assert.isTrue(map.isInBounds({ x: map.width - 1, y: map.height - 1 }));
      assert.isTrue(map.isInBounds({ x: 0, y: map.height - 1 }));
    });
    it('should return false', function () {
      assert.isFalse(map.isInBounds({ x: -1, y: map.height }));
      assert.isFalse(map.isInBounds({ x: map.width, y: -1 }));
      assert.isFalse(map.isInBounds({ x: map.width + 1, y: map.height }));
      assert.isFalse(map.isInBounds({ x: map.width, y: map.height }));
    });
  });

  describe('properties', function () {
    it('should have correct drawWidth', function () {
      assert.equal(map.drawWidth, 5 * 32);
    });
    it('should have correct drawHeight', function () {
      assert.equal(map.drawHeight, 5 * 32);
    });
    it('should have correct indexWidth', function () {
      assert.equal(map.tilesets[0].indexWidth, 6);
    });
    it('should have correct indexHeight', function () {
      assert.equal(map.tilesets[0].indexHeight, 9);
    });
    it('should have tileProperties', function () {
      assert.equal(map.tileProperties[0].type, 'floor');
    });
  });
});
