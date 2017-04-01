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
const Collision = require('./Collision');

define('App', [], () => {
  const app = this;

  this.player = null;
  this.gameInterval = null;
  this.game = null;
  this.stage = null;
  this.passwordHandler = null;
  this.draw = null;
  this.gameLoopInterval = 20;
  this.collision = null;

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

    app.collision = new Collision(app);
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

  function gameLoop() {
    app.player.getInput();
    if (!app.player.isDead && !app.game.isPaused) {
      update();
      app.collision.checkCollision();
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
