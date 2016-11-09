// TODO: Rename this to app.js
// TODO: Remove jQuery.
const $ = require('jquery');

define('JakesJourney',
  [
    './AwesomeError',
    './Constants/Constants',
    './DeathMessages',
    './Coordinates',
    './Helpers/Dom',
    './Stage',
    './Sprite',
    './Map',
    './Keyboard',
    './Utility',
    './ObscurelyNamedFile',
    './Draw/Draw',
    './Hud/Sidebar',
    './Credits',
    './Game',
    './Init'],
  (
    AwesomeError,
    Constants,
    DeathMessages,
    Coordinates,
    Dom,
    Stage,
    Sprite,
    Map,
    Keyboard,
    Utility,
    ObscurelyNamedFile,
    Draw,
    Sidebar,
    Credits,
    Game,
    Init
  ) => {
    // TODO: Remove jQuery.
    const $j = $.noConflict();

    let player;
    let gameInterval = null;
    let game;
    let stage;
    let passwordHandler;

    let globalDraw;
    this.globalDraw = null;
    this.gameLoopInterval = 20;

    // TODO: Modularize this.
    const GameObject = function GameObject() {
      this.processMap = function processMap(data) {
        const TileCodes = Constants.tileCodes;
        if (typeof (data) === 'string') {
          game.map = new Map(JSON.parse(data), game, stage);
        } else {
          game.map = new Map(data, game, stage);
        }

        // Put player on start tile.
        player.position = game.map.getCoordsByTileIndex(
          game.map.layers[0].data.indexOf(TileCodes.start)
        );

        // Load items.
        game.items = [];
        game.iDataArray = Utility.array.findByProperty(game.map.layers, 'name', 'Items', true);

        if (game.iDataArray !== null) {
          for (let i = 0; i < game.iDataArray.objects.length; i += 1) {
            const iData = game.iDataArray.objects[i];
            const item = new Sprite.Sprite(game, stage, null, this.globalDraw, null, player);

            item.tileGraphic = iData.gid;
            item.spriteID = `item ${i}`;
            item.nameID = iData.name;
            item.type = 'item';

            if (game.map.tileProperties[iData.gid - 1] === null) {
              if (game.debug) {
                Utility.console.log(`NULL:  ${iData.gid}`);
              }
            }
            item.subType = game.map.tileProperties[iData.gid - 1].type;
            if (game.debug) {
              Utility.console.log(item.subType);
            }
            item.imageType = 'tile';
            item.color = game.map.tileProperties[iData.gid - 1].color;
            item.position = new Coordinates(
              (iData.x) / Constants.baseUnit,
              (iData.y - Constants.baseUnit) / Constants.baseUnit
            );
            item.linksTo = iData.properties.linksTo;

            item.message = iData.properties.Text;

            item.callback = iData.properties.callback;
            item.destroyOnUse = iData.properties.destroyOnUse === 'true';

            game.items.push(item);

            if (typeof (iData.properties.destination) !== 'undefined') {
              item.destination = iData.properties.destination;
            }
          }
        }

        // Count money.
        game.moneyCount = Utility.array.findAllByProperty(game.items, 'subType', 'money', true).length;

        // Load enemies.
        game.enemies = [];

        game.eDataArray = Utility.array.findByProperty(game.map.layers, 'name', 'Enemies', true);
        if (game.eDataArray !== null) {
          for (let i = 0; i < game.eDataArray.objects.length; i += 1) {
            const eData = game.eDataArray.objects[i];
            const enemy = new Sprite.Sprite(game, stage, null, this.globalDraw, null, player);

            enemy.tileGraphic = eData.gid;
            enemy.spriteID = `enemy ${i}`;
            enemy.nameID = eData.name;
            enemy.type = 'enemy';
            enemy.subType = game.map.tileProperties[eData.gid - 1].type;
            enemy.imageType = 'tile';
            enemy.position = new Coordinates(
              eData.x / Constants.baseUnit,
              (eData.y - Constants.baseUnit) / Constants.baseUnit
            );
            enemy.speed = game.defaultEnemySpeed;

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

            game.enemies.push(enemy);
          }
        }

        game.tools = [];

        game.tDataArray = Utility.array.findByProperty(game.map.layers, 'name', 'Tools', true);
        if (game.tDataArray !== null) {
          for (let i = 0; i < game.tDataArray.objects.length; i += 1) {
            const tData = game.tDataArray.objects[i];
            const tool = new Sprite.Sprite(game, stage, null, this.globalDraw, null, player);

            tool.tileGraphic = tData.gid;
            tool.spriteID = `tool ${i}`;
            tool.type = 'tool';
            tool.subType = game.map.tileProperties[tData.gid - 1].type;
            tool.imageType = 'tile';
            tool.color = game.map.tileProperties[tData.gid - 1].color;
            tool.position = new Coordinates(
              tData.x / Constants.baseUnit,
              (tData.y - Constants.baseUnit) / Constants.baseUnit
            );

            // Change initial enemy facing direction.
            if (typeof (tData.properties.direction) !== 'undefined') {
              tool.direction = Constants.directions[tData.properties.direction];
            }

            game.tools.push(tool);
          }
        }
        game.map.setProperties();
      };
      // TODO: All of the map stuff should be its own module, or even a group of modules.
      this.loadMap = function loadMap(levelNumberArg) {
        let levelNumber = levelNumberArg;
        game.winMessage = null;
        game.isPaused = false;
        game.atExit = false;
        player.inventory = new Sprite.Inventory();
        player.isDead = false;
        game.gameTimer = 0;
        game.clock = -1;
        game.brownSwitch = false;

        if (game.level < 0) {
          levelNumber = 'cheater';
        }
        // TODO: Remove jQuery.
        //       This can't be accomplished until I get the bundling working for all of the
        //       JSON-formatted level files.
        $j.ajax({
          url: `Assets/Levels/${levelNumber}.json`,
          async: false,
          error(response) {
            const awesomeError = new AwesomeError({
              attemptedFunction: 'loadMap (ajax)',
              errorCode: response.status,
              position: player.position,
              level: game.level,
            });
            awesomeError.go();
          },
          success: this.processMap,
        });
      };

      this.restartLevel = function restartLevel() {
        this.loadMap(game.level);
      };

      this.nextLevel = function nextLevel() {
        this.level = game.nextLevelNumber;
        this.atExit = false;
        player.inventory = new Sprite.Inventory();
        this.loadMap(this.level);
      };
    };

    // TODO: Move to Init.js
    function doPreWork(bypassTouchscreen) {
      const init = new Init();
      if (!init.handleTouchScreen(bypassTouchscreen)) { return false; }

      // TODO: Add support to Dom object for array of dom elements.
      const errorPanels = document.getElementsByClassName('errorPanel');
      if (errorPanels.length) {
        for (let i = 0; i < errorPanels.length; i += 1) {
          const error = new Dom(errorPanels[i]);
          error.remove();
        }
      }

      if (!init.checkBrowserSupport()) { return false; }
      if (!init.checkProtocol()) { return false; }
      init.setStyle();


      stage = new Stage();
      game = new Game();
      Object.assign(game, new GameObject());

      passwordHandler = new ObscurelyNamedFile(game);

      globalDraw = this.globalDraw = new Draw(game, stage, null);
      game.assets.gridLineCoordinates = this.globalDraw.generateGridLines();

      const keyboard = new Keyboard();
      keyboard.settings.exclusions = ['F5', 'F11', 'F12', 'Control'];
      keyboard.wireUp(document);

      player = new Sprite.Sprite(game, stage, keyboard, this.globalDraw, passwordHandler, null);
      player.imageType = 'image';
      player.image = game.assets.face;
      player.type = 'player';
      player.player = player;

      this.globalDraw.player = player;

      game.hud = new Sidebar(game, stage, player, globalDraw);
      game.credits = new Credits(game, stage, this.globalDraw);


      return true;
    }

    function update() {
      // Reset message box visibility.
      game.showMessage = false;

      if (game.mode === Constants.gameModes.credits) {
        game.credits.update();
        return;
      }

      if (game.atExit) {
        if (game.theEnd) {
          if (game.credits.isStarted === false) {
            // Credits sequence!
            game.mode = Constants.gameModes.credits;
            game.credits.isStarted = true;
          }
        } else {
          // Todo: Different messages for dungeon levels!
          game.showMessage = true;
          if (!game.winMessage) {
            game.winMessage = `${Utility.array.getRandomElement(DeathMessages.win)}\n\nPress Enter to continue.`;
          }
          game.messageText = game.winMessage;
        }

        return;
      }

      game.gameTimer += 1;

      if (!(game.gameTimer % game.timerModulus)) {
        if (game.clock > -1) {
          game.clock -= 1;
        }
      }

      if (!player.isDead) {
        // Must update tools before updating enemies to prevent pushblock bug.
        for (let i = 0; i < game.tools.length; i += 1) {
          game.tools[i].update();
        }

        for (let i = 0; i < game.enemies.length; i += 1) {
          game.enemies[i].update();
        }
      }
    }

    function checkCollision() {
      game.redSwitch = false;
      game.yellowSwitch = false;
      game.greenSwitch = false;
      game.onQuickCorruptTile = false;

      // Register item hits.
      for (let i = 0; i < game.items.length; i += 1) {
        // TODO: Refactor with "areSpritesColliding".
        if (player.position.x === game.items[i].position.x
          && player.position.y === game.items[i].position.y) {
          // Player interacts with item.
          game.items[i].registerHit(player);
        } else {
          for (let j = 0; j < game.enemies.length; j += 1) {
            const enemy = game.enemies[j];
            // TODO: Refactor with "areSpritesColliding".
            if (enemy.position.x === game.items[i].position.x
              && enemy.position.y === game.items[i].position.y) {
              // Enemy interacts with item.
              game.items[i].registerHit(enemy);
            }
          }
          for (let j = 0; j < game.tools.length; j += 1) {
            // Check if pushblocks collide with items (switches?).
            const tool = game.tools[j];

            if (Utility.areSpritesColliding(tool, game.items[i])) {
              // Enemy interacts with item.
              game.items[i].registerHit(tool);
            }
          }
        }
      }

      // Register enemy hits.
      for (let i = 0; i < game.enemies.length; i += 1) {
        // TODO: Refactor with "areSpritesColliding".
        if (player.position.x === game.enemies[i].position.x
          && player.position.y === game.enemies[i].position.y) {
          player.isDead = true;
          game.enemies[i].hasKilledPlayer = true;

          let message = '';
          if (typeof (DeathMessages[game.enemies[i].subType]) !== 'undefined') {
            message = Utility.array.getRandomElement(DeathMessages[game.enemies[i].subType]);
          } else {
            // TODO: Refactor as constants message.
            message = `BUG!\n\nThe game has registered you as dead. If you're seeing this message, it's a bug in the level. Contact Jake and tell him that he accidentally put a(n) ${game.enemies[i].subType} in the Enemy array (which is why you died when you touched it). )`;
          }

          game.setDeadMessage(message);
        }
      }

      if (!game.clock) {
        player.isDead = true;
        const message = Utility.array.getRandomElement(DeathMessages.time);
        game.setDeadMessage(message);
      }

      // Countdown timer for remaining quick corruption.
      if (game.corruptionTimer > 0) {
        game.corruptionTimer -= 1;
      } else if (game.incrementCorruption) {
        // Permanent corruption.
        game.corruption += 1;

        if (game.atExit && game.corruption < game.corruptionSpeedupThreshold) {
          game.corruptionTimer = 10;
        } else {
          game.corruptionTimer = 50;
        }

        if (game.corruption > game.maxCorruption) {
          game.incrementCorruption = false;
          game.nextLevel();
        }
      } else {
        // Quick corruption.
        game.corruption = 0;
      }

      player.crushCheck();
    }

    function gameLoop() {
      player.getInput();
      if (!player.isDead && !game.isPaused) {
        update();
        checkCollision();
      }
      this.globalDraw.beginDraw();
    }

    this.run = function run(bypassTouchscreen = false) {
      if (gameInterval !== null) {
        window.clearInterval(gameInterval);
      }

      const continueRunning = doPreWork(bypassTouchscreen);
      if (!continueRunning) { return; }

      game.nextLevel();

      // Game Loop.
      gameInterval = setInterval(gameLoop, this.gameLoopInterval);
    };

    const myDoc = new Dom(document);
    myDoc.ready(() => {
      this.run(false);
    });
  });
