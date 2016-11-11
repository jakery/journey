define('Sidebar',
  [
    '../Constants/Constants',
    '../Coordinates',
    './PauseOverlay',
    './MessageBox',
    './Inventory',
  ],
  (
    _constants,
    Coordinates,
    PauseOverlay,
    MessageBox,
    Inventory
  ) => {
    // TODO: Refactor as class.
    const Sidebar = function Sidebar(game, stage, player, globalDraw) {
      this.game = game;
      this.stage = stage;
      this.player = player;
      this.globalDraw = globalDraw;

      this.backgroundColor = '';
      this.textColor = '';

      this.messageBox = new MessageBox(this.game, this.globalDraw);
      this.pauseOverlay = new PauseOverlay(this.stage, this.globalDraw);
      this.inventory = new Inventory(this.game, this.player, this.globalDraw);

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
          this.drawNormalSidebar();
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
        if (game.passwordSidebarMessage.length > 0) {
          ctx.save();
          ctx.fillStyle = 'rgb(255,0,0)';
          ctx.fillText(game.passwordSidebarMessage, 500, 118);
          ctx.restore();
        }

        this.globalDraw.drawWrappedText('Press ENTER to submit.\nPress ESC to return to title.', 500, 160, 270, 30);

        ctx.restore();
      };

      this.drawNormalSidebar = function drawNormalSidebar() {
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

        this.inventory.draw();

        // Draw help message.
        if (game.showMessage) {
          this.messageBox.draw();
        }

        if (game.isPaused) {
          this.pauseOverlay.draw();
        }
      };

      // TODO: Is helpMessage even a thing? Am I using this, ever?
      //       If not, destroy it.
      this.helpMessage = ((function helpMessage() {
        this.settings = {
          background: {
            fillStyle: 'rgb(50,50,50)',
            x: 21,
            y: 21,
            width: 272,
            height: 95,
          },
        };
        this.draw = function draw() {
          // Telltale lack of draw method. Hmmmm.
        };
        return this;
      })());
    };
    return Sidebar;
  });
