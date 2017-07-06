// TODO: Check for items to decouple
const RenderSettings = require('../Constants/RenderSettings');
const Constants = require('../Constants/Constants');
const Coordinates = require('../Coordinates');
const SpriteArguments = require('../Sprite/SpriteArguments');
const Item = require('../Sprite/Item');
const EnemyFactory = require('../Sprite/Enemy/EnemyFactory');

define('Map', ['../Utility/Utility', '../ObscurelyNamedFile', '../Sprite/Sprite'], (Utility, PasswordHandler, Sprite) => function Map(map, game, stage) {
  this.game = game;
  this.stage = stage;
  this.passwordHandler = new PasswordHandler();
  this.newSpriteArgs = spriteData => new SpriteArguments(this.game, this.stage, null, this.globalDraw, null, this.player, spriteData);
  this.enemyFactory = new EnemyFactory(this.newSpriteArgs(null));

  // Defaults. Will be overridden below if replacement parameters exist.
  this.parameters = {
    wrapAround: false,
    tileset: 'devgraphics',
  };

  this.getTileIndexByCoords = function getTileIndexByCoords(x, y) {
    if (x instanceof Coordinates) {
      return (x.y * this.width) + x.x;
    }
    return (y * this.width) + x;
  };

  this.isInBounds = function isInBounds(coords) {
    return coords.x >= 0
      && coords.x < this.width
      && coords.y > 0
      && coords.y < this.height;
  };

  this.getCoordsByTileIndex = function getCoordsByTileIndex(i) {
    return new Coordinates(
      i % this.width,
      Math.floor(i / this.width)
    );
  };

  this.getTileTypeByCoords = function getTileTypeByCoords(x, y) {
    if (typeof x === 'object' && {}.hasOwnProperty.call(x, 'x') && {}.hasOwnProperty.call(x, 'y')) {
      return this.getTileTypeByCoords(x.x, x.y);
    }
    const arrayIndex = this.getTileIndexByCoords(x, y);
    return this.layers[0].data[arrayIndex];
  };


  this.getAllIndexesOfTile = function getAllIndexesOfTile(type) {
    return Utility.array.getAllIndexes(this.layers[0].data, type);
  };

  this.findAllToolsByType = function findAllToolsByType(type) {
    const toolsArray = Utility.array.findByProperty(this.layers, 'name', 'Tools', true);
    return Utility.array.findAllByProperty(toolsArray.objects, 'gid', type, true);
  };

  this.changeTileType = function changeTileType(x, y, type) {
    const arrayIndex = this.getTileIndexByCoords(x, y);
    this.layers[0].data[arrayIndex] = type;
  };

  this.setDrawDimensions = function setDrawDimensions() {
    // TODO: Rename all references to these.
    this.pixelWidth = this.width * RenderSettings.baseUnit;
    this.drawWidth = this.pixelWidth;

    this.pixelHeight = this.height * RenderSettings.baseUnit;
    this.drawHeight = this.pixelHeight;

    for (let i = 0; i < this.tilesets.length; i += 1) {
      this.tilesets[i].indexWidth =
        this.tilesets[0].imagewidth / this.tilesets[0].tilewidth;
      this.tilesets[i].indexHeight =
        this.tilesets[0].imageheight / this.tilesets[0].tileheight;
    }
  };

  this.setProperties = function setProperties() {
    // TODO: Refactor parameters. Make it freaking consistent.
    const parametersObject = Utility.array.findByProperty(this.layers, 'name', 'Parameters', true);

    if (parametersObject !== null && typeof parametersObject.properties !== 'undefined') {
      Object.assign(this.parameters, parametersObject.properties);
    }

    this.game.setProperties({
      mode: typeof this.parameters.mode !== 'undefined'
        ? Constants.gameModes[this.parameters.mode]
        : Constants.gameModes.normal,
      // TODO: Shouldn't this always be gotten from the passwordArray?
      password: typeof (this.parameters.password) !== 'undefined'
        ? this.game.password = this.parameters.password
        : this.passwordHandler.passwordArray[game.level],
      nextLevelNumber: typeof (this.parameters.nextLevel) !== 'undefined'
        ? this.parameters.nextLevel
        : this.game.level + 1,
      clock: typeof (this.parameters.time) !== 'undefined'
        ? parseInt(this.parameters.time, 10)
        : -1,
    });
    // TODO: The three load___() functions should be merged into one.


    this.stage.setProperties({
      isOffset: !(typeof (this.parameters.stageOffset) !== 'undefined' && this.parameters.stageOffset === 'false'),
    });

    // TODO: Can this be removed?
    this.parameters.tileset = typeof (this.parameters.tileset) !== 'undefined'
      ? this.parameters.tileset
      : 'devgraphics'; // TODO: Remove magic string.
  };

  this.loadSprites = function loadSprites() {
    const sprites = {};
    sprites.items = this.loadItems();
    sprites.enemies = this.loadEnemies();
    sprites.tools = this.loadTools();
    return sprites;
  };

  this.loadItems = function loadItems() {
    const itemDataArray = Utility.array.findByProperty(this.layers, 'name', 'Items', true);
    const items = [];
    if (itemDataArray !== null) {
      for (let i = 0; i < itemDataArray.objects.length; i += 1) {
        const itemData = itemDataArray.objects[i];
        itemData.id = i;
        itemData.subType = this.tileProperties[itemData.gid - 1].type;
        itemData.color = this.tileProperties[itemData.gid - 1].color;

        const item = new Item(this.newSpriteArgs(itemData));
        items.push(item);

        if (typeof (itemData.properties.destination) !== 'undefined') {
          item.destination = itemData.properties.destination;
        }
      }
    }
    return items;
  };

  // TODO: The three load___() functions should be merged into one.
  this.loadEnemies = function loadEnemies() {
    const enemyDataArray = this.getSpriteDataArray('Enemies');
    const enemies = enemyDataArray.map(enemyData => this.enemyFactory.createFrom(enemyData));
    return enemies;
  };

  this.getSpriteDataArray = function getSpriteDataArray(type) {
    const rawArray = Utility.array.findByProperty(this.layers, 'name', type, true);
    const spriteArray = [];
    if (rawArray !== null) {
      for (let i = 0; i < rawArray.objects.length; i += 1) {
        const eData = rawArray.objects[i];
        eData.id = i;
        eData.subType = this.tileProperties[eData.gid - 1].type;
        spriteArray.push(eData);
      }
    }
    return spriteArray;
  };

  // TODO: The three load___() functions should be merged into one.
  this.loadTools = function loadTools() {
    const tools = [];

    const tDataArray = Utility.array.findByProperty(this.layers, 'name', 'Tools', true);
    if (tDataArray !== null) {
      for (let i = 0; i < tDataArray.objects.length; i += 1) {
        const tData = tDataArray.objects[i];
        const tool = new Sprite(this.newSpriteArgs(tData));

        tool.tileGraphic = tData.gid;
        tool.spriteID = `tool ${i}`;
        tool.type = 'tool';
        tool.subType = this.tileProperties[tData.gid - 1].type;
        tool.imageType = 'tile';
        tool.color = this.tileProperties[tData.gid - 1].color;
        tool.position = new Coordinates(
          tData.x / RenderSettings.baseUnit,
          (tData.y - RenderSettings.baseUnit) / RenderSettings.baseUnit
        );

        // Change initial enemy facing direction.
        if (typeof (tData.properties.direction) !== 'undefined') {
          tool.direction = Constants.directions[tData.properties.direction];
        }

        tools.push(tool);
      }
    }
    return tools;
  };

  Object.assign(this, map);
  this.setDrawDimensions();

  this.tileProperties = this.tilesets[0].tileproperties;
});
