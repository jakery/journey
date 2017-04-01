const Constants = require('./Constants/Constants');
const Utility = require('./Utility/Utility');
const DeathMessages = require('./Constants/DeathMessages');

define('Update', [], () => function Update(app) {
  this.app = app;
  this.doUpdate = function doUpdate() {
    // Reset message box visibility.
    this.app.game.showMessage = false;

    if (this.app.game.mode === Constants.gameModes.credits) {
      this.app.game.credits.update();
      return;
    }

    if (this.app.game.atExit) {
      if (this.app.game.theEnd) {
        if (this.app.game.credits.isStarted === false) {
          // Credits sequence!
          this.app.game.mode = Constants.gameModes.credits;
          this.app.game.credits.isStarted = true;
        }
      } else {
        // Todo: Different messages for dungeon levels!
        this.app.game.showMessage = true;
        if (!this.app.game.winMessage) {
          this.app.game.winMessage = `${Utility.array.getRandomElement(DeathMessages.win)}\n\nPress Enter to continue.`;
        }
        this.app.game.messageText = this.app.game.winMessage;
      }

      return;
    }

    this.app.game.gameTimer += 1;

    if (!(this.app.game.gameTimer % this.app.game.timerModulus)) {
      if (this.app.game.clock > -1) {
        this.app.game.clock -= 1;
      }
    }

    if (!this.app.player.isDead) {
      // Must update tools before updating enemies to prevent pushblock bug.
      for (let i = 0; i < this.app.game.tools.length; i += 1) {
        this.app.game.tools[i].update();
      }

      for (let i = 0; i < this.app.game.enemies.length; i += 1) {
        this.app.game.enemies[i].update();
      }
    }
  };
});
