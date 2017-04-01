const Dom = require('./Helpers/Dom');
const Init = require('./Init');

define('App', [], () => {
  this.player = null;
  this.gameInterval = null;
  this.game = null;
  this.stage = null;
  this.passwordHandler = null;
  this.draw = null;
  this.gameLoopInterval = 20;
  this.update = null;
  this.collision = null;
  this.init = null;

  this.gameLoop = function gameLoop() {
    this.player.getInput();
    if (!this.player.isDead && !this.game.isPaused) {
      this.update.doUpdate();
      this.collision.checkCollision();
    }
    this.draw.beginDraw();
  };

  this.run = function run(bypassTouchscreen = false) {
    if (this.gameInterval !== null) {
      window.clearInterval(this.gameInterval);
    }
    if (this.init === null) {
      this.init = new Init(this);
    }
    const continueRunning = this.init.doPreWork(bypassTouchscreen);
    if (!continueRunning) { return; }
    this.game.nextLevel();
    this.gameInterval = window.setInterval(this.gameLoop.bind(this), this.gameLoopInterval);
  };

  const myDoc = new Dom(document);
  myDoc.ready(() => { this.run(); });
});
