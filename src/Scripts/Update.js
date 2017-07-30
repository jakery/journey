// Todo: Identify things to decouple.
const Constants = require('./Constants/Constants');
const Utility = require('./Utility/Utility');
const DeathMessages = require('./Constants/DeathMessages');

define('Update', [], () => function Update(app) {
  this.app = app;
  this.doUpdate = function doUpdate() {
    const game = this.app.game;
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

    if (!this.app.player.isDead) {
      // Must update tools before updating enemies to prevent pushblock bug.
      for (let i = 0; i < game.tools.length; i += 1) {
        game.tools[i].update();
      }

      for (let i = 0; i < game.enemies.length; i += 1) {
        game.enemies[i].update();
      }
    }
  };
});
