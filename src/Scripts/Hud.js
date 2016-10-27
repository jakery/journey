define('Hud', ['./TileCodes', './Coordinates'], (TileCodes, Coordinates) => {
  // TODO: Refactor as class.
  const gameHudClass = function (game, stage, player, draw) {
    this.game = game;
    this.stage = stage;
    this.player = player;
    if (!this.player) throw new Error('no player');
    this.draw = draw;

    this.backgroundColor = '';
    this.textColor = '';
    this.messageBox = {};
    this.messageBox.backgroundColor = '';
    this.messageBox.textColor = '';

    this.Draw = function () {
      if (game.map.parameters.tileset === 'dungeon') {
        this.backgroundColor = 'rgb(50,20,10)';
        this.textColor = 'rgb(225,225,185)';
        this.messageBox.backgroundColor = 'rgb(99,40,30)';
        this.messageBox.textColor = 'rgb(200,180,170)';
      } else {
        this.backgroundColor = 'rgb(230,230,200)';
        this.textColor = 'rgb(0,0,0)';
        this.messageBox.backgroundColor = 'rgb(210,205,235)';
        this.messageBox.textColor = 'rgb(0,0,0)';
      }

      // Draw background.
      this.draw.ctx.fillStyle = this.backgroundColor;
      this.draw.ctx.fillRect(stage.hudCoords.x, stage.hudCoords.y, stage.hudWidth, stage.hudHeight);

      this.draw.ctx.fillStyle = this.textColor;

      if (game.mode === 'normal') {
        this.DrawNormalHud();
      } else if (game.mode === 'title') {
        this.drawTitle();
      } else if (game.mode === 'password') {
        this.drawPassword();
      }
    };

    this.drawTitle = function () {
      this.draw.ctx.save();
      this.draw.ctx.font = '28px sans-serif';

      this.draw.ctx.fillText('Jake\'s Journey', 500, 20);

      this.draw.ctx.font = '20px sans-serif';
      this.draw.drawWrappedText('Press ENTER to begin.\nPress X to enter password.', 500, 80, 270, 30);
      this.draw.ctx.restore();
    };

    this.drawPassword = function () {
      this.draw.ctx.save();
      this.draw.ctx.font = '28px sans-serif';
      this.draw.ctx.fillStyle = this.textColor;
      this.draw.drawWrappedText('Jake\'s Journey', 500, 20, 270, 40);

      this.draw.ctx.font = '24px sans-serif';
      this.draw.drawWrappedText('Enter Password.', 500, 60, 270, 40);

      // Text box.
      this.draw.ctx.fillStyle = 'white';
      this.draw.ctx.font = '20px sans-serif';
      this.draw.ctx.fillRect(500, 90, stage.hudWidth - 60, 26);

      // Cursor
      this.draw.ctx.fillStyle = 'rgb(0,255,255)';
      this.draw.ctx.fillRect(505 + this.draw.ctx.measureText(this.game.enteredPassword).width, 93, 15, 20);

      this.draw.ctx.fillStyle = 'rgb(0,0,0)';
      this.draw.ctx.fillText(this.game.enteredPassword, 505, 92);

      // Message.
      if (game.passwordHudMessage.length > 0) {
        this.draw.ctx.save();
        this.draw.ctx.fillStyle = 'rgb(255,0,0)';
        this.draw.ctx.fillText(game.passwordHudMessage, 500, 118);
        this.draw.ctx.restore();
      }

      this.draw.drawWrappedText('Press ENTER to submit.\nPress ESC to return to title.', 500, 160, 270, 30);

      this.draw.ctx.restore();
    };

    this.DrawNormalHud = function () {
      let drawLevel = game.level;
      if (drawLevel === 54) {
        drawLevel = 27;
      } else if (drawLevel === 53) {
        drawLevel = 1;
      }

      // Draw level text.
      this.draw.ctx.fillStyle = this.textColor;
      this.draw.ctx.fillText(`Level  ${drawLevel}`, 500, 20);

      // Draw game clock.
      if (game.clock > -1) {
        this.draw.ctx.fillText(`Time:  ${game.clock}`, 620, 20);
      } else {
        this.draw.ctx.fillText('Time: \u221E', 620, 20);
      }

      // Draw password.
      this.draw.ctx.fillText(`Password: ${game.password}`, 500, 50);

      // Draw money count:
      let interval = Math.floor(273 / game.moneyCount);
      interval = Math.min(interval, 13);
      for (let i = 0; i < game.moneyCount; i += 1) {
        if (i < player.inventory.money) {
          // Collected money:
          this.draw.drawTileAbsolute(TileCodes.coin, new Coordinates(495 + (i * interval), 80));
        } else {
          // Uncollected money:
          this.draw.drawTileAbsolute(TileCodes.coinUncollected, new Coordinates(495 + (i * interval), 80));
        }
      }

      // Draw keys.
      let keyDrawIndex = 0;
      const totalKeys =
        this.player.inventory.yellowKeys +
        this.player.inventory.redKeys +
        this.player.inventory.cyanKeys +
        this.player.inventory.greenKeys;
      const keyInterval = (totalKeys < 9)
        ? 32
        : Math.floor(273 / (totalKeys));

      // Draw yellow key inventory.
      for (let i = 0; i < player.inventory.yellowKeys; i += 1) {
        this.draw.drawTileAbsolute(TileCodes.yellowKey,
          new Coordinates(500 + (keyDrawIndex * keyInterval), 110));
        keyDrawIndex += 1;
      }

      // Draw red key inventory.
      for (let i = 0; i < player.inventory.redKeys; i += 1) {
        this.draw.drawTileAbsolute(TileCodes.redKey,
          new Coordinates(500 + (keyDrawIndex * keyInterval), 110));
        keyDrawIndex += 1;
      }

      // Draw cyan key inventory.
      for (let i = 0; i < player.inventory.cyanKeys; i += 1) {
        this.draw.drawTileAbsolute(TileCodes.cyanKey,
          new Coordinates(500 + (keyDrawIndex * keyInterval), 110));
        keyDrawIndex += 1;
      }

      // Draw green key inventory.
      for (let i = 0; i < player.inventory.greenKeys; i += 1) {
        this.draw.drawTileAbsolute(
          TileCodes.greenKey,
          new Coordinates(500 + (keyDrawIndex * keyInterval), 110)
        );
        keyDrawIndex += 1;
      }

      // Draw help message.
      if (game.showMessage) {
        this.draw.ctx.save();
        this.draw.ctx.fillStyle = this.messageBox.backgroundColor;
        this.draw.ctx.font = '12px sans-serif';
        this.draw.ctx.fillRect(500, 160, 280, 200);
        this.draw.ctx.fillStyle = this.messageBox.textColor;
        this.draw.drawWrappedText(game.messageText, 510, 170, 270, 18);
        this.draw.ctx.restore();
      }

      if (game.isPaused) {
        this.draw.ctx.save();

        // Draw shade over game.
        this.draw.ctx.save();
        this.draw.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.draw.ctx.fillRect(0, 0, stage.playboxWidth, stage.playboxHeight);
        this.draw.ctx.restore();

        // Draw pause box.
        this.draw.ctx.save();
        this.draw.ctx.fillStyle = 'red';
        this.draw.ctx.fillRect(20, 20, 274, 97);
        this.draw.ctx.fillStyle = 'rgb(50,50,50)';
        this.draw.ctx.fillRect(21, 21, 272, 95);
        this.draw.ctx.restore();

        // Draw pause text.
        this.draw.ctx.save();
        this.draw.ctx.fillStyle = 'red';
        this.draw.ctx.font = '20px sans-serif';
        this.draw.drawWrappedText('PAUSED.\n\nPress P to resume.\nPress Enter to restart level.', 26, 26, 270, 22);
        this.draw.ctx.restore();

        this.draw.ctx.restore();
      }
    };
  };
  return gameHudClass;
});
