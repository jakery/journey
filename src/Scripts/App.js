const AwesomeError = require('./AwesomeError');
const Constants = require('./Constants/Constants');
const TileCodes = require('./Constants/TileCodes');
const DeathMessages = require('./Constants/DeathMessages');
const Inventory = require('./Sprite/Inventory');
const Dom = require('./Helpers/Dom');
const Stage = require('./Stage');
const Player = require('./Sprite/Player');
const Map = require('./Map/Map');
const Keyboard = require('./Keyboard');
const Utility = require('./Utility/Utility');
const ObscurelyNamedFile = require('./ObscurelyNamedFile');
const Draw = require('./Draw/Draw');
const Sidebar = require('./Display/Sidebar');
const Credits = require('./Display/Credits');
const Game = require('./Game');
const Init = require('./Init');

define('App', [], () => {
  const app = this;

  this.player = null;
  this.gameInterval = null;
  this.game = null;
  this.stage = null;
  this.passwordHandler = null;
  this.draw = null;
  this.gameLoopInterval = 20;

  // TODO: Finish modularizing this to Game.js.
  const GameObject = function GameObject() {

  };

  // TODO: Move to Init.js
  function doPreWork(bypassTouchscreen, app) {
    const init = new Init();
    if (!init.handleTouchScreen(bypassTouchscreen, app)) { return false; }
    init.removeErrorPanels();
    if (!init.checkBrowserSupport()) { return false; }
    if (!init.checkProtocol()) { return false; }
    init.setStyle();


    app.stage = this.stage = new Stage();
    app.game = new Game(app);
    Object.assign(app.game, new GameObject());

    app.passwordHandler = new ObscurelyNamedFile(app.game);

    app.draw = new Draw(app.game, app.stage, null);
    app.game.assets.gridLineCoordinates = app.draw.generateGridLines();

    const keyboard = new Keyboard();
    keyboard.settings.exclusions = ['F5', 'F11', 'F12', 'Control'];
    keyboard.wireUp(document);

    app.player = this.player = new Player(app.game,
      app.stage,
      keyboard,
      app.draw,
      app.passwordHandler,
      app.game.assets.face
    );

    app.game.player = app.player;
    app.draw.player = app.player;

    app.game.hud = new Sidebar(app.game, app.stage, app.player, app.draw);
    app.game.credits = new Credits(app.game, app.stage, app.draw);

    return true;
  }

  function update() {
    // Reset message box visibility.
    app.game.showMessage = false;

    if (app.game.mode === Constants.gameModes.credits) {
      app.game.credits.update();
      return;
    }

    if (app.game.atExit) {
      if (app.game.theEnd) {
        if (app.game.credits.isStarted === false) {
          // Credits sequence!
          app.game.mode = Constants.gameModes.credits;
          app.game.credits.isStarted = true;
        }
      } else {
        // Todo: Different messages for dungeon levels!
        app.game.showMessage = true;
        if (!app.game.winMessage) {
          app.game.winMessage = `${Utility.array.getRandomElement(DeathMessages.win)}\n\nPress Enter to continue.`;
        }
        app.game.messageText = app.game.winMessage;
      }

      return;
    }

    app.game.gameTimer += 1;

    if (!(app.game.gameTimer % app.game.timerModulus)) {
      if (app.game.clock > -1) {
        app.game.clock -= 1;
      }
    }

    if (!app.player.isDead) {
      // Must update tools before updating enemies to prevent pushblock bug.
      for (let i = 0; i < app.game.tools.length; i += 1) {
        app.game.tools[i].update();
      }

      for (let i = 0; i < app.game.enemies.length; i += 1) {
        app.game.enemies[i].update();
      }
    }
  }

  function checkCollision() {
    app.game.redSwitch = false;
    app.game.yellowSwitch = false;
    app.game.greenSwitch = false;
    app.game.onQuickCorruptTile = false;

    // Register item hits.
    for (let i = 0; i < app.game.items.length; i += 1) {
      if (Utility.areSpritesColliding(app.player, app.game.items[i])) {
        app.game.items[i].registerHit(app.player);
      } else {
        for (let j = 0; j < app.game.enemies.length; j += 1) {
          const enemy = app.game.enemies[j];
          if (Utility.areSpritesColliding(enemy, app.game.items[i])) {
            app.game.items[i].registerHit(enemy);
          }
        }
        for (let j = 0; j < app.game.tools.length; j += 1) {
          // Check if pushblocks collide with items (switches?).
          const tool = app.game.tools[j];

          if (Utility.areSpritesColliding(tool, app.game.items[i])) {
            // Enemy interacts with item.
            app.game.items[i].registerHit(tool);
          }
        }
      }
    }

    // Register enemy hits.
    for (let i = 0; i < app.game.enemies.length; i += 1) {
      // TODO: Refactor with "areSpritesColliding".
      if (Utility.areSpritesColliding(app.player, app.game.enemies[i])) {
        app.player.isDead = true;
        app.game.enemies[i].hasKilledPlayer = true;

        let message = '';
        if (typeof (DeathMessages[app.game.enemies[i].subType]) !== 'undefined') {
          message = Utility.array.getRandomElement(DeathMessages[app.game.enemies[i].subType]);
        } else {
          // TODO: Refactor as constants message.
          message = `BUG!\n\nThe game has registered you as dead. If you're seeing this message, it's a bug in the level. Contact Jake and tell him that he accidentally put a(n) ${app.game.enemies[i].subType} in the Enemy array (which is why you died when you touched it). )`;
        }

        app.game.setDeadMessage(message);
      }
    }

    if (!app.game.clock) {
      app.player.isDead = true;
      const message = Utility.array.getRandomElement(DeathMessages.time);
      app.game.setDeadMessage(message);
    }

    // Countdown timer for remaining quick corruption.
    if (app.game.corruptionTimer > 0) {
      app.game.corruptionTimer -= 1;
    } else if (app.game.incrementCorruption) {
      // Permanent corruption.
      app.game.corruption += 1;

      if (app.game.atExit && app.game.corruption < app.game.corruptionSpeedupThreshold) {
        app.game.corruptionTimer = 10;
      } else {
        app.game.corruptionTimer = 50;
      }

      if (app.game.corruption > app.game.maxCorruption) {
        app.game.incrementCorruption = false;
        app.game.nextLevel();
      }
    } else {
      // Quick corruption.
      app.game.corruption = 0;
    }

    app.player.crushCheck();
  }

  function gameLoop() {
    app.player.getInput();
    if (!app.player.isDead && !app.game.isPaused) {
      update();
      checkCollision();
    }
    app.draw.beginDraw();
  }

  this.run = function run(bypassTouchscreen = false) {
    if (app.gameInterval !== null) {
      window.clearInterval(app.gameInterval);
    }

    const continueRunning = doPreWork(bypassTouchscreen, this);
    if (!continueRunning) { return; }

    app.game.nextLevel();

    // Game Loop.
    app.gameInterval = setInterval(gameLoop, app.gameLoopInterval);
  };

  const myDoc = new Dom(document);
  myDoc.ready(() => {
    this.run(false);
  });
});
