const Dom = require('./Helpers/Dom');
const Init = require('./Init');

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
  this.init = null;

  this.gameLoop = function gameLoop() {
    self.player.getInput();
    if (!self.player.isDead && !self.game.isPaused) {
      self.update.doUpdate();
      self.collision.checkCollision();
    }
    self.draw.beginDraw();
  };

  this.run = function run(bypassTouchscreen = false) {
    if (self.gameInterval !== null) {
      window.clearInterval(self.gameInterval);
    }
    if (self.init === null) {
      self.init = new Init(self);
    }
    const continueRunning = self.init.doPreWork(bypassTouchscreen);
    if (!continueRunning) { return; }
    self.game.nextLevel();
    self.gameInterval = setInterval(self.gameLoop, self.gameLoopInterval);
  };

  const myDoc = new Dom(document);
  myDoc.ready(() => { this.run(); });
});
