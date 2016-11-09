// TODO: Remove jQuery.
const $ = require('jquery');

define('App',
  [
    './AwesomeError',
    './Constants/Constants',
    './DeathMessages',
    './Coordinates',
    './Helpers/Dom',
    './Stage',
    './Sprite/Sprite',
    './Sprite/Player',
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
    Player,
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

    const self = this;

    this.player = null;
    this.gameInterval = null;
    this.game = null;
    this.stage = null;
    this.passwordHandler = null;
    this.draw = null;
    this.gameLoopInterval = 20;

    // TODO: Modularize this.
    const GameObject = function GameObject() {
      this.processMap = function processMap(data) {
        const TileCodes = Constants.tileCodes;
        if (typeof (data) === 'string') {
          self.game.map = new Map(JSON.parse(data), self.game, self.stage);
        } else {
          self.game.map = new Map(data, self.game, self.stage);
        }

        // Put player on start tile.
        self.player.position = self.game.map.getCoordsByTileIndex(
          self.game.map.layers[0].data.indexOf(TileCodes.start)
        );

        self.game.items = self.game.map.loadItems();
        self.game.enemies = self.game.map.loadEnemies();
        self.game.tools = self.game.map.loadTools();
        self.game.moneyCount = Utility.array.findAllByProperty(self.game.items, 'subType', 'money', true).length;
        self.game.map.setProperties();
      };
      // TODO: All of the map stuff should be its own module, or even a group of modules.
      this.loadMap = function loadMap(levelNumberArg) {
        let levelNumber = levelNumberArg;
        self.game.resetLevelVariables();
        self.player.resetLevelVariables();

        if (self.game.level < 0) {
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
              position: self.player.position,
              level: self.game.level,
            });
            awesomeError.go();
          },
          success: this.processMap,
        });
      };

      this.nextLevel = function nextLevel() {
        this.level = self.game.nextLevelNumber;
        this.atExit = false;
        self.player.inventory = new Sprite.Inventory();
        this.loadMap(this.level);
      };
    };

    // TODO: Move to Init.js
    function doPreWork(bypassTouchscreen) {
      const init = new Init();
      if (!init.handleTouchScreen(bypassTouchscreen)) { return false; }
      init.removeErrorPanels();
      if (!init.checkBrowserSupport()) { return false; }
      if (!init.checkProtocol()) { return false; }
      init.setStyle();


      self.stage = this.stage = new Stage();
      self.game = new Game();
      Object.assign(self.game, new GameObject());

      self.passwordHandler = new ObscurelyNamedFile(self.game);

      self.draw = new Draw(self.game, self.stage, null);
      self.game.assets.gridLineCoordinates = self.draw.generateGridLines();

      const keyboard = new Keyboard();
      keyboard.settings.exclusions = ['F5', 'F11', 'F12', 'Control'];
      keyboard.wireUp(document);

      self.player = this.player = new Player(self.game,
        self.stage,
        keyboard,
        self.draw,
        self.passwordHandler,
        self.game.assets.face
      );

      self.game.player = self.player;
      self.draw.player = self.player;

      self.game.hud = new Sidebar(self.game, self.stage, self.player, self.draw);
      self.game.credits = new Credits(self.game, self.stage, self.draw);

      return true;
    }

    function update() {
      // Reset message box visibility.
      self.game.showMessage = false;

      if (self.game.mode === Constants.gameModes.credits) {
        self.game.credits.update();
        return;
      }

      if (self.game.atExit) {
        if (self.game.theEnd) {
          if (self.game.credits.isStarted === false) {
            // Credits sequence!
            self.game.mode = Constants.gameModes.credits;
            self.game.credits.isStarted = true;
          }
        } else {
          // Todo: Different messages for dungeon levels!
          self.game.showMessage = true;
          if (!self.game.winMessage) {
            self.game.winMessage = `${Utility.array.getRandomElement(DeathMessages.win)}\n\nPress Enter to continue.`;
          }
          self.game.messageText = self.game.winMessage;
        }

        return;
      }

      self.game.gameTimer += 1;

      if (!(self.game.gameTimer % self.game.timerModulus)) {
        if (self.game.clock > -1) {
          self.game.clock -= 1;
        }
      }

      if (!self.player.isDead) {
        // Must update tools before updating enemies to prevent pushblock bug.
        for (let i = 0; i < self.game.tools.length; i += 1) {
          self.game.tools[i].update();
        }

        for (let i = 0; i < self.game.enemies.length; i += 1) {
          self.game.enemies[i].update();
        }
      }
    }

    function checkCollision() {
      self.game.redSwitch = false;
      self.game.yellowSwitch = false;
      self.game.greenSwitch = false;
      self.game.onQuickCorruptTile = false;

      // Register item hits.
      for (let i = 0; i < self.game.items.length; i += 1) {
        if (Utility.areSpritesColliding(self.player, self.game.items[i])) {
          self.game.items[i].registerHit(self.player);
        } else {
          for (let j = 0; j < self.game.enemies.length; j += 1) {
            const enemy = self.game.enemies[j];
            if (Utility.areSpritesColliding(enemy, self.game.items[i])) {
              self.game.items[i].registerHit(enemy);
            }
          }
          for (let j = 0; j < self.game.tools.length; j += 1) {
            // Check if pushblocks collide with items (switches?).
            const tool = self.game.tools[j];

            if (Utility.areSpritesColliding(tool, self.game.items[i])) {
              // Enemy interacts with item.
              self.game.items[i].registerHit(tool);
            }
          }
        }
      }

      // Register enemy hits.
      for (let i = 0; i < self.game.enemies.length; i += 1) {
        // TODO: Refactor with "areSpritesColliding".
        if (Utility.areSpritesColliding(self.player, self.game.enemies[i])) {
          self.player.isDead = true;
          self.game.enemies[i].hasKilledPlayer = true;

          let message = '';
          if (typeof (DeathMessages[self.game.enemies[i].subType]) !== 'undefined') {
            message = Utility.array.getRandomElement(DeathMessages[self.game.enemies[i].subType]);
          } else {
            // TODO: Refactor as constants message.
            message = `BUG!\n\nThe game has registered you as dead. If you're seeing this message, it's a bug in the level. Contact Jake and tell him that he accidentally put a(n) ${self.game.enemies[i].subType} in the Enemy array (which is why you died when you touched it). )`;
          }

          self.game.setDeadMessage(message);
        }
      }

      if (!self.game.clock) {
        self.player.isDead = true;
        const message = Utility.array.getRandomElement(DeathMessages.time);
        self.game.setDeadMessage(message);
      }

      // Countdown timer for remaining quick corruption.
      if (self.game.corruptionTimer > 0) {
        self.game.corruptionTimer -= 1;
      } else if (self.game.incrementCorruption) {
        // Permanent corruption.
        self.game.corruption += 1;

        if (self.game.atExit && self.game.corruption < self.game.corruptionSpeedupThreshold) {
          self.game.corruptionTimer = 10;
        } else {
          self.game.corruptionTimer = 50;
        }

        if (self.game.corruption > self.game.maxCorruption) {
          self.game.incrementCorruption = false;
          self.game.nextLevel();
        }
      } else {
        // Quick corruption.
        self.game.corruption = 0;
      }

      self.player.crushCheck();
    }

    function gameLoop() {
      self.player.getInput();
      if (!self.player.isDead && !self.game.isPaused) {
        update();
        checkCollision();
      }
      self.draw.beginDraw();
    }

    this.run = function run(bypassTouchscreen = false) {
      if (self.gameInterval !== null) {
        window.clearInterval(self.gameInterval);
      }

      const continueRunning = doPreWork(bypassTouchscreen);
      if (!continueRunning) { return; }

      self.game.nextLevel();

      // Game Loop.
      self.gameInterval = setInterval(gameLoop, self.gameLoopInterval);
    };

    const myDoc = new Dom(document);
    myDoc.ready(() => {
      this.run(false);
    });
  });
