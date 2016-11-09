define('Map', ['./Constants/Constants', './Coordinates', './Utility/Utility', './ObscurelyNamedFile', './Sprite/Sprite'], (Constants, Coordinates, Utility, PasswordHandler, Sprite) => function Map(map, game, stage) {
  this.game = game;
  this.stage = stage;
  this.passwordHandler = new PasswordHandler();

  // Defaults. Will be overridden below if replacement parameters exist.
  this.parameters = {
    wrapAround: false,
    tileset: 'devgraphics',
  };

  this.getTileIndexByCoords = function getTileIndexByCoords(x, y) {
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
    const arrayIndex = this.getTileIndexByCoords(x, y);
    return this.layers[0].data[arrayIndex];
  };

  this.changeTileType = function changeTileType(x, y, type) {
    const arrayIndex = this.getTileIndexByCoords(x, y);
    this.layers[0].data[arrayIndex] = type;
  };

  this.setDrawDimensions = function setDrawDimensions() {
    // TODO: Rename all references to these.
    this.drawWidth = this.pixelWidth = this.width * Constants.baseUnit;
    this.drawHeight = this.pixelHeight = this.height * Constants.baseUnit;

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

  this.loadItems = function loadItems() {
    const itemDataArray = Utility.array.findByProperty(this.layers, 'name', 'Items', true);
    const items = [];
    if (itemDataArray !== null) {
      for (let i = 0; i < itemDataArray.objects.length; i += 1) {
        const itemData = itemDataArray.objects[i];
        const item = new Sprite.Sprite(
          this.game,
          this.stage,
          null,
          this.globalDraw,
          null,
          this.player
        );

        item.tileGraphic = itemData.gid;
        item.spriteID = `item ${i}`;
        item.nameID = itemData.name;
        item.type = 'item';

        if (this.tileProperties[itemData.gid - 1] === null) {
          if (game.debug) {
            Utility.console.log(`NULL:  ${itemData.gid}`);
          }
        }
        item.subType = this.tileProperties[itemData.gid - 1].type;
        if (game.debug) {
          Utility.console.log(item.subType);
        }
        item.imageType = 'tile';
        item.color = this.tileProperties[itemData.gid - 1].color;
        item.position = new Coordinates(
          (itemData.x) / Constants.baseUnit,
          (itemData.y - Constants.baseUnit) / Constants.baseUnit
        );
        item.linksTo = itemData.properties.linksTo;

        item.message = itemData.properties.Text;

        item.callback = itemData.properties.callback;
        item.destroyOnUse = itemData.properties.destroyOnUse === 'true';

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
    const enemies = [];
    const enemyDataArray = Utility.array.findByProperty(this.layers, 'name', 'Enemies', true);
    if (enemyDataArray !== null) {
      for (let i = 0; i < enemyDataArray.objects.length; i += 1) {
        const eData = enemyDataArray.objects[i];
        const enemy = new Sprite.Sprite(
          this.game,
          this.stage,
          null,
          this.draw,
          null,
          this.player
        );

        enemy.tileGraphic = eData.gid;
        enemy.spriteID = `enemy ${i}`;
        enemy.nameID = eData.name;
        enemy.type = 'enemy';
        enemy.subType = this.tileProperties[eData.gid - 1].type;
        enemy.imageType = 'tile';
        enemy.position = new Coordinates(
          eData.x / Constants.baseUnit,
          (eData.y - Constants.baseUnit) / Constants.baseUnit
        );
        enemy.speed = this.game.defaultEnemySpeed;

        // Change initial enemy facing direction.
        if (typeof (eData.properties.direction) !== 'undefined') {
          enemy.direction = Constants.directions[eData.properties.direction];
          if (enemy.subType === 'player2') {
            enemy.rotation = enemy.getRotation();
          }
        }

        if (typeof (eData.properties.autoMove) !== 'undefined') {
          enemy.autoMove = eData.properties.autoMove === 'true';
        }

        if (enemy.subType === 'smartPredator') {
          enemy.speed = 3;
        }

        enemies.push(enemy);
      }
    }
    return enemies;
  };

  // TODO: The three load___() functions should be merged into one.
  this.loadTools = function loadTools() {
    const tools = [];

    const tDataArray = Utility.array.findByProperty(this.layers, 'name', 'Tools', true);
    if (tDataArray !== null) {
      for (let i = 0; i < tDataArray.objects.length; i += 1) {
        const tData = tDataArray.objects[i];
        const tool = new Sprite.Sprite(
          this.game,
          this.stage,
          null,
          this.draw,
          null,
          this.player
        );

        tool.tileGraphic = tData.gid;
        tool.spriteID = `tool ${i}`;
        tool.type = 'tool';
        tool.subType = this.tileProperties[tData.gid - 1].type;
        tool.imageType = 'tile';
        tool.color = this.tileProperties[tData.gid - 1].color;
        tool.position = new Coordinates(
          tData.x / Constants.baseUnit,
          (tData.y - Constants.baseUnit) / Constants.baseUnit
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
