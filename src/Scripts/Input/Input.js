
const Constants = require('../Constants/Constants');

define('Input', [], () => {
  const Input = function Input() {
    this.readKeyboard = function readKeyboard() {
      const keyIsDown = this.keyboard.keyIsDown;
      const keyIsRegistered = this.keyboard.keyIsRegistered;
      // Todo: Refactor these literals to constants defined in separate file.

      // Player is at title screen. Press enter to start.
      // Press X to enter password. No other input allowed except for konami code.
      if (this.game.mode === Constants.gameModes.title) {
        // TODO: Change all (keyIsDown && !keyIsRegistered) calls into a control mapping function
        //       with a callback for when the event is true.
        if (keyIsDown.Enter && !keyIsRegistered.Enter) {
          keyIsRegistered.Enter = true;
          this.game.nextLevel();
        } else if ((keyIsDown.X && !keyIsRegistered.X) || (keyIsDown.x && !keyIsRegistered.x)) {
          keyIsRegistered.X = true;
          this.game.mode = Constants.gameModes.password;
        } else if (this.keyboard.konamiCode()) {
          // :)
          this.game.mode = Constants.gameModes.normal;
        }
      } else if (this.game.mode === Constants.gameModes.password) {
        if (keyIsDown.Enter && !keyIsRegistered.Enter) {
          keyIsRegistered.Enter = true;

          this.passwordHandler.process();
        } else if (keyIsDown.Esc && !keyIsRegistered.Esc) {
          keyIsRegistered.Esc = true;
          this.game.passwordSidebarMessage = Constants.emptyString;
          this.game.enteredPassword = Constants.emptyString;
          this.game.mode = Constants.gameModes.normal;
        } else if (keyIsDown.Backspace && !keyIsRegistered.Backspace) {
          keyIsRegistered.Backspace = true;
          this.game.enteredPassword = this.game.enteredPassword.slice(0, -1);
        } else {
          // Get keyboard.alphanumeric input.
          for (let i = 0; i < this.keyboard.alphanumeric.length; i += 1) {
            const alphanumericTX = this.keyboard.alphanumericTX[i];
            if (keyIsDown[alphanumericTX] && !keyIsRegistered[alphanumericTX]) {
              keyIsRegistered[alphanumericTX] = true;

              if (this.game.enteredPassword.length < this.maxPasswordLength) {
                this.game.enteredPassword += this.keyboard.alphanumeric[i];
              }
            }
          }
        }

        if (this.game.enteredPassword.length > 0) {
          this.game.passwordSidebarMessage = Constants.emptyString;
        }
      } else if (this.game.mode === Constants.gameModes.credits) {
        if (keyIsDown.Enter && !keyIsRegistered.Enter) {
          keyIsRegistered.Enter = true;

          // Hit enter once to skip credit fades. Hit it again to return to title.
          if (this.game.credits.sequence === 2) {
            this.game.returnToTitle();
          } else {
            this.game.credits.sequence = 2;
          }
        }
      } else {
        // Player is at exit. Press enter to continue. No other input allowed.
        if (this.game.atExit) {
          // If the game is perma-corrupted, you can't manually advance to the next level.
          if (!this.game.incrementCorruption && !this.game.theEnd) {
            if (keyIsDown.Enter && !keyIsRegistered.Enter) {
              keyIsRegistered.Enter = true;
              this.game.nextLevel();
            }
          }
          return;
        }

        // Player is dead. Press enter to restart. No other input allowed.
        if (this.game.player.isDead) {
          if (keyIsDown.Enter && !keyIsRegistered.Enter) {
            keyIsRegistered.Enter = true;
            this.game.restartLevel();
          }
          return;
        }

        // Game paused. Press enter to restart. May also press "P" to unpause game.
        if (this.game.isPaused) {
          if (keyIsDown.Enter && !keyIsRegistered.Enter) {
            keyIsRegistered.Enter = true;
            this.game.restartLevel();
            return;
          }
        }

        // Pause or unpause game.
        if (keyIsDown.P && !keyIsRegistered.P) {
          keyIsRegistered.P = true;
          this.game.isPaused = this.game.isPaused.toggle();
        }

        if (!this.game.isPaused && !this.game.theEnd) {
          // Next level for debug purposes.
          if (this.game.betaTest) {
            if (keyIsDown.N && !keyIsRegistered.N) {
              keyIsRegistered.N = true;
              this.game.nextLevel();
            }
          }

          // Execute "goForward" movement from first key to return true.
          // TODO: Refactor this into an array and loop.
          // eslint-disable-next-line no-unused-vars
          let stopCheck = false;

          stopCheck =
            this.executeInput('A', this.keyboardRepeatTickDelay, this.goForward, [Constants.directions.left]) ||
            this.executeInput('D', this.keyboardRepeatTickDelay, this.goForward, [Constants.directions.right]) ||
            this.executeInput('W', this.keyboardRepeatTickDelay, this.goForward, [Constants.directions.up]) ||
            this.executeInput('S', this.keyboardRepeatTickDelay, this.goForward, [Constants.directions.down]) ||
            this.executeInput('LEFT', this.keyboardRepeatTickDelay, this.goForward, [Constants.directions.left]) ||
            this.executeInput('RIGHT', this.keyboardRepeatTickDelay, this.goForward, [Constants.directions.right]) ||
            this.executeInput('UP', this.keyboardRepeatTickDelay, this.goForward, [Constants.directions.up]) ||
            this.executeInput('DOWN', this.keyboardRepeatTickDelay, this.goForward, [Constants.directions.down]);
        } else if (this.game.theEnd) {
          if (this.startCountup) {
            this.ticks += 1;

            // 20-tick delay.
            // TODO: Remove magic number.
            if (this.ticks > 20) {
              this.autoMove = true;
              // TODO: Remove magic number.

              if (this.game.gameTimer % 6) {
                return;
              }
              this.turn(Constants.directions.right);
              this.goForward();
            }
          }
        }
      }
    };
  };
  return Input;
});
