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
      if (Utility.areSpritesColliding(this.player, this.game.items[i])) {
        this.game.items[i].registerHit(this.player);
      } else {
        for (let j = 0; j < this.game.enemies.length; j += 1) {
          const enemy = this.game.enemies[j];
          if (Utility.areSpritesColliding(enemy, this.game.items[i])) {
            this.game.items[i].registerHit(enemy);
          }
        }
        for (let j = 0; j < this.game.tools.length; j += 1) {
          // Check if pushblocks collide with items (switches?).
          const tool = this.game.tools[j];

          if (Utility.areSpritesColliding(tool, this.game.items[i])) {
            // Enemy interacts with item.
            this.game.items[i].registerHit(tool);
          }
        }
      }
    }

    // Register enemy hits.
    for (let i = 0; i < this.game.enemies.length; i += 1) {
      // TODO: Refactor with "areSpritesColliding".
      if (Utility.areSpritesColliding(this.player, this.game.enemies[i])) {
        this.player.isDead = true;
        this.game.enemies[i].hasKilledPlayer = true;

        let message = '';
        if (typeof (DeathMessages[this.game.enemies[i].subType]) !== 'undefined') {
          message = Utility.array.getRandomElement(DeathMessages[this.game.enemies[i].subType]);
        } else {
          // TODO: Refactor as constants message.
          message = `BUG!\n\nThe game has registered you as dead. If you're seeing this message, it's a bug in the level. Contact Jake and tell him that he accidentally put a(n) ${this.game.enemies[i].subType} in the Enemy array (which is why you died when you touched it). )`;
        }

        this.game.setDeadMessage(message);
      }
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
