define('Hud', ['./Constants', './Coordinates'], (_constants, Coordinates) => {
  // TODO: Refactor as class.
  const Hud = function gameHudClass(game, stage, player, globalDraw) {
    this.game = game;
    this.stage = stage;
    this.player = player;
    if (!this.player) throw new Error('no player');
    this.globalDraw = globalDraw;

    this.backgroundColor = '';
    this.textColor = '';
    this.messageBox = {};
    this.messageBox.backgroundColor = '';
    this.messageBox.textColor = '';

    this.pauseOverlay = (function pauseOverlay() {
      this.settings = {
        border: {
          fillStyle: 'red',
          x: 20,
          y: 20,
          width: 274,
          height: 97,
        },
        background: {
          fillStyle: 'rgb(50,50,50)',
          x: 21,
          y: 21,
          width: 272,
          height: 95,
        },
        text: {
          value: 'PAUSED.\n\nPress P to resume.\nPress Enter to restart level.',
          x: 26,
          y: 26,
          maxWidth: 270,
          lineHeight: 22,
          font: '20px sans-serif',
          fillStyle: 'red',
        },
      };
      this.draw = function draw() {
        const ctx = this.globalDraw.ctx;
        ctx.save();

        // Draw shade over game.
        ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(
          stage.playboxX,
          stage.playboxY,
          stage.playboxWidth,
          stage.playboxHeight
        );
        ctx.restore();

        // Draw pause box.
        ctx.save();
        ctx.fillStyle = this.settings.border.fillStyle;
        ctx.fillRect(
          this.settings.border.x,
          this.settings.border.y,
          this.settings.border.width,
          this.settings.border.height
        );
        ctx.fillStyle = this.settings.background.fillStyle;
        ctx.fillRect(
          this.settings.background.x,
          this.settings.background.y,
          this.settings.background.width,
          this.settings.background.height
        );
        ctx.restore();

        // Draw pause text.
        ctx.save();
        ctx.fillStyle = this.settings.text.fillStyle;
        ctx.font = this.settings.text.font;
        this.globalDraw.drawWrappedText(
          this.settings.text.value,
          this.settings.text.x,
          this.settings.text.y,
          this.settings.text.maxWidth,
          this.settings.text.lineHeight
        );
        ctx.restore();

        ctx.restore();
      };
      return this;
    }());

    this.draw = function draw() {
      const ctx = this.globalDraw.ctx;
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
      ctx.fillStyle = this.backgroundColor;
      ctx.fillRect(
        stage.hudCoords.x,
        stage.hudCoords.y,
        stage.hudWidth,
        stage.hudHeight
      );

      ctx.fillStyle = this.textColor;

      if (game.mode === _constants.gameModes.normal) {
        this.drawNormalHud();
      } else if (game.mode === _constants.gameModes.title) {
        this.drawTitle();
      } else if (game.mode === _constants.gameModes.password) {
        this.drawPassword();
      }
    };

    this.drawTitle = function drawTitle() {
      const ctx = this.globalDraw.ctx;
      ctx.save();
      ctx.font = '28px sans-serif';

      ctx.fillText('Jake\'s Journey', 500, 20);

      ctx.font = '20px sans-serif';
      this.globalDraw.drawWrappedText('Press ENTER to begin.\nPress X to enter password.', 500, 80, 270, 30);
      ctx.restore();
    };

    this.drawPassword = function drawPassword() {
      const ctx = this.globalDraw.ctx;
      ctx.save();
      ctx.font = '28px sans-serif';
      ctx.fillStyle = this.textColor;
      this.globalDraw.drawWrappedText('Jake\'s Journey', 500, 20, 270, 40);

      ctx.font = '24px sans-serif';
      this.globalDraw.drawWrappedText('Enter Password.', 500, 60, 270, 40);

      // Text box.
      ctx.fillStyle = 'white';
      ctx.font = '20px sans-serif';
      ctx.fillRect(500, 90, stage.hudWidth - 60, 26);

      // Cursor
      ctx.fillStyle = 'rgb(0,255,255)';
      ctx.fillRect(505 + ctx.measureText(this.game.enteredPassword).width, 93, 15, 20);

      ctx.fillStyle = 'rgb(0,0,0)';
      ctx.fillText(this.game.enteredPassword, 505, 92);

      // Message.
      if (game.passwordHudMessage.length > 0) {
        ctx.save();
        ctx.fillStyle = 'rgb(255,0,0)';
        ctx.fillText(game.passwordHudMessage, 500, 118);
        ctx.restore();
      }

      this.globalDraw.drawWrappedText('Press ENTER to submit.\nPress ESC to return to title.', 500, 160, 270, 30);

      ctx.restore();
    };

    this.drawNormalHud = function drawNormalHud() {
      const ctx = this.globalDraw.ctx;
      let drawLevel = game.level;
      if (drawLevel === 54) {
        drawLevel = 27;
      } else if (drawLevel === 53) {
        drawLevel = 1;
      }

      // Draw level text.
      ctx.fillStyle = this.textColor;
      ctx.fillText(`Level  ${drawLevel}`, 500, 20);

      // Draw game clock.
      if (game.clock > -1) {
        ctx.fillText(`Time:  ${game.clock}`, 620, 20);
      } else {
        ctx.fillText('Time: \u221E', 620, 20);
      }

      // Draw password.
      ctx.fillText(`Password: ${game.password}`, 500, 50);

      // Draw money count:
      let interval = Math.floor(273 / game.moneyCount);
      interval = Math.min(interval, 13);
      for (let i = 0; i < game.moneyCount; i += 1) {
        const xBase = new Coordinates(495 + (i * interval));
        if (i < player.inventory.money) {
          // Collected money:
          this.globalDraw.drawTileAbsolute(_constants.tileCodes.coin, xBase, 80);
        } else {
          // Uncollected money:
          this.globalDraw.drawTileAbsolute(_constants.tileCodes.coinUncollected, xBase, 80);
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
        this.globalDraw.drawTileAbsolute(_constants.tileCodes.yellowKey,
          new Coordinates(500 + (keyDrawIndex * keyInterval), 110));
        keyDrawIndex += 1;
      }

      // Draw red key inventory.
      for (let i = 0; i < player.inventory.redKeys; i += 1) {
        this.globalDraw.drawTileAbsolute(_constants.tileCodes.redKey,
          new Coordinates(500 + (keyDrawIndex * keyInterval), 110));
        keyDrawIndex += 1;
      }

      // Draw cyan key inventory.
      for (let i = 0; i < player.inventory.cyanKeys; i += 1) {
        this.globalDraw.drawTileAbsolute(_constants.tileCodes.cyanKey,
          new Coordinates(500 + (keyDrawIndex * keyInterval), 110));
        keyDrawIndex += 1;
      }

      // Draw green key inventory.
      for (let i = 0; i < player.inventory.greenKeys; i += 1) {
        this.globalDraw.drawTileAbsolute(
          _constants.tileCodes.greenKey,
          new Coordinates(500 + (keyDrawIndex * keyInterval), 110)
        );
        keyDrawIndex += 1;
      }

      // Draw help message.
      if (game.showMessage) {
        ctx.save();
        ctx.fillStyle = this.messageBox.backgroundColor;
        ctx.font = '12px sans-serif';
        ctx.fillRect(500, 160, 280, 200);
        ctx.fillStyle = this.messageBox.textColor;
        this.globalDraw.drawWrappedText(game.messageText, 510, 170, 270, 18);
        ctx.restore();
      }

      if (game.isPaused) {
        this.pauseOverlay.draw();
      }
    };
  };
  return Hud;
});
