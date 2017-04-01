const Dom = require('./Helpers/Dom');
const Stage = require('./Stage');
const Player = require('./Sprite/Player');
const Keyboard = require('./Keyboard');
const ObscurelyNamedFile = require('./ObscurelyNamedFile');
const Draw = require('./Draw/Draw');
const Sidebar = require('./Display/Sidebar');
const Credits = require('./Display/Credits');
const Game = require('./Game');
const Init = require('./Init');
const Collision = require('./Collision');
const Update = require('./Update');

define('App', [], () => {
  const self = this;

  this.player = null;
  this.gameInterval = null;
  this.game = null;
  this.stage = null;
  this.passwordHandler = null;
  this.draw = null;
  this.gameLoopInterval = 20;
  this.update = null;
  this.collision = null;

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

    app.update = new Update(app);
    app.collision = new Collision(app);
    return true;
  }

  function gameLoop() {
    self.player.getInput();
    if (!self.player.isDead && !self.game.isPaused) {
      self.update.doUpdate();
      self.collision.checkCollision();
    }
    self.draw.beginDraw();
  }

  this.run = function run(bypassTouchscreen = false) {
    if (self.gameInterval !== null) {
      window.clearInterval(self.gameInterval);
    }
    const continueRunning = doPreWork(bypassTouchscreen, this);
    if (!continueRunning) { return; }
    self.game.nextLevel();
    self.gameInterval = setInterval(gameLoop, self.gameLoopInterval);
  };

  const myDoc = new Dom(document);
  myDoc.ready(() => {
    this.run(false);
  });
});
