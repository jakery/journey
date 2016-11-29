/* eslint-disable prefer-arrow-callback */
const Map = require('./Map');
const Game = require('../Game');
const Stage = require('../Stage');
const TileCodes = require('../Constants/TileCodes');

describe('Map', function DescribeMap() {
  let map;
  beforeEach(function beforeEach() {
    map = new Map({
      /* eslint-disable */
      width: 5,
      height: 5,
      layers: [
        {
          name: "Map",
          data: [
            50, 2, 2, 3, 5,
            5, 6, 2, 2, 10,
            2, 2, 17, 13, 14,
            15, 1, 1, 1, 1,
            1, 21, 22, 23, 2
          ]
        },
        {
          name: 'Tools',
          objects: [
            {
              "gid": 15, // pushBlock
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 64,
              "y": 96
            },
            {
              "gid": 15, // pushBlock
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 96,
              "y": 96
            }
          ]
        },
        {
          "height": 12,
          "name": "Enemies",
          "objects": [
            {
              "gid": 7,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 160,
              "y": 352
            },
            {
              "gid": 9,
              "height": 0,
              "name": "",
              "properties":
              {
                "direction": "left"
              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 416,
              "y": 160
            },
            {
              "gid": 27,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 288,
              "y": 352
            },
            {
              "gid": 25,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 32,
              "y": 352
            },
            {
              "gid": 27,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 160,
              "y": 64
            }],
          "opacity": 1,
          "type": "objectgroup",
          "visible": true,
          "width": 15,
          "x": 0,
          "y": 0
        },
        {
          "height": 12,
          "name": "Items",
          "objects": [
            {
              "gid": 22,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 224,
              "y": 192
            },
            {
              "gid": 8,
              "height": 0,
              "name": "",
              "properties":
              {
                "Text": "This is really just meant to be a title screen. Whatever, go ahead and play."
              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 32,
              "y": 128
            },
            {
              "gid": 12,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 416,
              "y": 96
            },
            {
              "gid": 12,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 64,
              "y": 224
            },
            {
              "gid": 12,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 192,
              "y": 288
            },
            {
              "gid": 12,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 352,
              "y": 192
            },
            {
              "gid": 34,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 416,
              "y": 64
            },
            {
              "gid": 37,
              "height": 0,
              "name": "",
              "properties":
              {
                "destination": "t1"
              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 64,
              "y": 320
            },
            {
              "gid": 43,
              "height": 0,
              "name": "t1",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 384,
              "y": 96
            },
            {
              "gid": 40,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 32,
              "y": 64
            },
            {
              "gid": 4,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 288,
              "y": 128
            },
            {
              "gid": 46,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 96,
              "y": 288
            },
            {
              "gid": 52,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 288,
              "y": 160
            },
            {
              "gid": 51,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 288,
              "y": 64
            },
            {
              "gid": 51,
              "height": 0,
              "name": "",
              "properties":
              {

              },
              "type": "",
              "visible": true,
              "width": 0,
              "x": 32,
              "y": 288
            }],
          "opacity": 1,
          "type": "objectgroup",
          "visible": true,
          "width": 15,
          "x": 0,
          "y": 0
        },
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

      /* eslint-enable */
    },
      new Game(),
      new Stage());
  });
  describe('getTileIndexByCoords()', function getTileIndexByCoords() {
    it('should return one dimensional index of coordinate.', function tests() {
      assert.equal(map.getTileIndexByCoords(0, 0), 0);
      assert.equal(map.getTileIndexByCoords(1, 0), 1);
      assert.equal(map.getTileIndexByCoords(2, 0), 2);
      assert.equal(map.getTileIndexByCoords(3, 0), 3);
      assert.equal(map.getTileIndexByCoords(0, 1), 5);
      assert.equal(map.getTileIndexByCoords(1, 1), 6);
      assert.equal(map.getTileIndexByCoords(4, 4), 24);
    });
  });

  describe('isInBounds()', function isInBounds() {
    it('should return true', function tests() {
      assert.isTrue(map.isInBounds({ x: map.width - 1, y: map.height - 1 }));
      assert.isTrue(map.isInBounds({ x: 0, y: map.height - 1 }));
    });
    it('should return false', function tests() {
      assert.isFalse(map.isInBounds({ x: -1, y: map.height }));
      assert.isFalse(map.isInBounds({ x: map.width, y: -1 }));
      assert.isFalse(map.isInBounds({ x: map.width + 1, y: map.height }));
      assert.isFalse(map.isInBounds({ x: map.width, y: map.height }));
    });
  });

  describe('getCoordsByTileIndex()', function getCoordsByTileIndex() {
    it('should return 2d coordinates converted from array index', function tests() {
      assert.deepEqual(map.getCoordsByTileIndex(0), { x: 0, y: 0 });
      assert.deepEqual(map.getCoordsByTileIndex(13), { x: 3, y: 2 });
      assert.deepEqual(map.getCoordsByTileIndex(24), { x: 4, y: 4 });
    });
  });

  describe('getTileTypeByCoords()', function getTileTypeByCoords() {
    it('should return value in data array corresponding to one-dimensional conversion.', function tests() {
      assert.equal(map.getTileTypeByCoords(2, 4), 22);
    });
    it('should break out the object into x and y coordinates and rerun the function.', function tests() {
      assert.equal(map.getTileTypeByCoords({ x: 2, y: 4 }), 22);
    });
  });

  describe('getAllIndexesOfTile()', function getAllIndexesOfTile() {
    it('should return indexes', function tests() {
      const indexes = map.getAllIndexesOfTile(TileCodes.dRedBlockInactive);
      assert.deepEqual(indexes, [12]);
    });
  });

  describe('findAllToolsByType()', function findAllToolsByType() {
    it('should return array of pushblocks', function tests() {
      const pushblockArray = map.findAllToolsByType(TileCodes.pushBlock);
      assert.equal(pushblockArray.length, 2);
      assert.deepEqual(pushblockArray, [map.layers[1].objects[0], map.layers[1].objects[1]]);
    });
  });

  describe('changeTileType()', function changeTileType() {
    it('should change the value of map.layers[0].data[0] to 20.', function tests() {
      assert.equal(map.layers[0].data[0], 50);
      map.changeTileType(0, 0, 20);
      assert.equal(map.layers[0].data[0], 20);
    });
    it('should change the value of map.layers[0].data[21] to 0.', function tests() {
      assert.equal(map.layers[0].data[21], 21);
      map.changeTileType(1, 4, 0);
      assert.equal(map.layers[0].data[21], 0);
    });
  });

  describe('setDrawDimensions', function setDrawDimensions() {
    it('should set properties in the map object', function tests() {
      map.setDrawDimensions();
      assert.equal(map.drawWidth, 160);
      assert.equal(map.drawHeight, 160);
      assert.equal(map.tilesets[0].indexWidth, 6);
      assert.equal(map.tilesets[0].indexHeight, 9);
    });
  });

  describe('setProperties', function setProperties() {
    it('should set properties of various things', function tests() {
      map.setProperties();
      assert.equal(map.game.mode, 2); // Constants.gameModes.normal = 2
      assert.equal(map.stage.isOffset, true);
      assert.equal(map.parameters.tileset, 'devgraphics');
    });
  });

  describe('loadItems', function loadItems() {
    it('should have an items array', function tests() {
      const itemsArray = map.loadItems();
      assert.equal(itemsArray.length, 15);
    });
    it('should have a properly made itemsArray[0]', function tests() {
      const itemsArray = map.loadItems();
      assert.equal(itemsArray[0].type, 'item');
      assert.equal(itemsArray[0].nameID, '');
      assert.equal(itemsArray[0].spriteID, 'item 0');
      assert.equal(itemsArray[0].subType, 'redKey');
    });
    it('should have a properly made itemsArray[14]', function tests() {
      const itemsArray = map.loadItems();
      assert.equal(itemsArray[14].type, 'item');
      assert.equal(itemsArray[14].nameID, '');
      assert.equal(itemsArray[14].spriteID, 'item 14');
      assert.equal(itemsArray[14].subType, 'switch');
    });
  });

  describe('loadEnemies', function loadEnemies() {
    it('should have an enemies array', function tests() {
      const enemiesArray = map.loadEnemies();
      assert.equal(enemiesArray.length, 5);
      assert.equal(enemiesArray[0].type, 'enemy');
      assert.equal(enemiesArray[0].nameID, '');
      assert.equal(enemiesArray[0].spriteID, 'enemy 0');
      assert.equal(enemiesArray[0].subType, 'nascar');
    });
  });

  describe('loadTools', function loadTools() {
    it('should have a tools array', function tests() {
      const toolsArray = map.loadTools();
      assert.equal(toolsArray.length, 2);
      assert.equal(toolsArray[0].spriteID, 'tool 0');
    });
  });

  describe('properties', function properties() {
    it('should have correct drawWidth', function tests() {
      assert.equal(map.drawWidth, 160);
    });
    it('should have correct drawHeight', function tests() {
      assert.equal(map.drawHeight, 160);
    });
    it('should have correct indexWidth', function tests() {
      assert.equal(map.tilesets[0].indexWidth, 6);
    });
    it('should have correct indexHeight', function tests() {
      assert.equal(map.tilesets[0].indexHeight, 9);
    });
    it('should have tileProperties', function tests() {
      assert.equal(map.tileProperties[0].type, 'floor');
    });
  });
});
