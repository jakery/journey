
// Todo: Identify things to decouple.
const Utility = require('./Utility/Utility');
const DeathMessages = require('./Constants/DeathMessages');

define('Collision', [], () => function Collision(app) {
  this.player = app.player;
  this.game = app.game;
  this.checkCollision = function checkCollision() {
    this.game.redSwitch = false;
    this.game.yellowSwitch = false;
    this.game.greenSwitch = false;
    this.game.onQuickCorruptTile = false;

    // Register item hits.
    for (let i = 0; i < this.game.items.length; i += 1) {
      this.game.items[i].checkCollision();
    }

    // Register enemy hits.
    for (let i = 0; i < this.game.enemies.length; i += 1) {
      this.game.enemies[i].checkCollision();
    }

    if (!this.game.clock) {
      this.player.isDead = true;
      const message = Utility.array.getRandomElement(DeathMessages.time);
      this.game.setDeadMessage(message);
    }

    // Countdown timer for remaining quick corruption.
    if (this.game.corruptionTimer > 0) {
      this.game.corruptionTimer -= 1;
    } else if (this.game.incrementCorruption) {
      // Permanent corruption.
      this.game.corruption += 1;
      if (this.game.atExit && this.game.corruption < this.game.corruptionSpeedupThreshold) {
        this.game.corruptionTimer = 10;
      } else {
        this.game.corruptionTimer = 50;
      }

      if (this.game.corruption > this.game.maxCorruption) {
        this.game.incrementCorruption = false;
        this.game.nextLevel();
      }
    } else {
      // Quick corruption.
      this.game.corruption = 0;
    }

    this.player.crushCheck();
  };
});
