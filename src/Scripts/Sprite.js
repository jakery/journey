define('Sprite', ['./Constants','./DeathMessages', './TileCodes', './Coordinates', './Keyboard', './Utility', './Draw'], (Constants, DeathMessages, TileCodes, Coordinates, Keyboard, Utility, Draw) => {
  const SpriteNS = {
    Inventory: function Inventory() {
      this.yellowKeys = 0;
      this.redKeys = 0;
      this.cyanKeys = 0;
      this.greenKeys = 0;
      this.money = 0;
    },

    Sprite: null,
  };
  SpriteNS.Sprite = function (game, stage, keyboard, draw, pwh, player) {
    this.game = game;
    this.stage = stage;
    this.keyboard = keyboard;
    this.draw = new Draw(game, stage, null, null);
    this.passwordHandler = pwh || null;
    this.player = player;

    this.baseUnit = 32;
    this.halfBaseUnit = this.baseUnit / 2;
    this.maxPasswordLength = 11;
    this.keyboardRepeatTickDelay = 10;


    this.isAlive = true;

    this.spriteID = null;
    this.nameID = '';
    this.travelableLayer = 'travelableTiles';
    this.inventory = new SpriteNS.Inventory();
    this.customVariables = {};
    this.verticalOffset = this.baseUnit * 1;
    this.horizontalOffset = this.baseUnit * 0;
    this.width = this.baseUnit * 1;
    this.height = this.baseUnit * 2;
    this.image = null;
    this.tileGraphic = null;
    this.speed = null;

    this.callback = null;
    this.destroyOnUse = false;

    this.isDead = false;
    this.hasKilledPlayer = false;

    this.visible = true;

    this.isPreferringClockwise = false;

    this.type = '';
    this.subType = '';

    this.isKey = function () { return this.subType == 'yellowKey' || this.subType == 'redKey' || this.subType == 'cyanKey' || this.subType == 'greenKey' };
    this.hitRegistered = false;

    this.imageType = '';

    this.displayName = '';

    this.message = '';

    this.startCountup = false;
    this.ticks = 0;
    this.autoMove = true;
    this.isMoving = false;
    this.isInteracting = false;
    this.isTileInteract = false;

    this.isTeleporting = false;

    this.interactionPointer = 0;
    this.interactionQueue = [];

    this.gettingPushed = false;

    this.destination = null;

    this.animationFrame = 0;
    this.animationDirection = 1;
    this.direction = 'down';
    this.rotation = 0;

    this.position = new Coordinates(0, 0);

    this.tileDistanceToSprite = function (sprite) {
      return this.tileDistanceBetween(this.position, sprite.position);
    };
    this.surroundingTiles = null;
    this.getSurroundingTiles = function (coords) {
      const surroundingTiles = {};
      surroundingTiles.up = {
        coords: new Coordinates(coords.x, coords.y - 1),
        type: null,
        score: null,
      };
      surroundingTiles.down = {
        coords: new Coordinates(coords.x, coords.y + 1),
        type: null,
        score: null,
      };
      surroundingTiles.left = {
        coords: new Coordinates(coords.x - 1, coords.y),
        type: null,
        score: null,
      };
      surroundingTiles.right = {

        coords: new Coordinates(coords.x + 1, coords.y),
        type: null,
        score: null,

      };
      // up
      Utility.aGreenBlockInactiveconsole.log('nothing');
      if (this.game.map.isInBounds(surroundingTiles.up.coords)) {
        surroundingTiles.up.type = this.game.map.getTileTypeByCoords(surroundingTiles.up.coords.x, surroundingTiles.up.coords.y);
      }
      if (this.game.map.isInBounds(surroundingTiles.down.coords)) {
        surroundingTiles.down.type = this.game.map.getTileTypeByCoords(surroundingTiles.down.coords.x, surroundingTiles.down.coords.y);
      }
      if (this.game.map.isInBounds(surroundingTiles.left.coords)) {
        surroundingTiles.left.type = this.game.map.getTileTypeByCoords(surroundingTiles.left.coords.x, surroundingTiles.left.coords.y);
      }
      if (this.game.map.isInBounds(surroundingTiles.right.coords)) {
        surroundingTiles.right.type = this.game.map.getTileTypeByCoords(surroundingTiles.right.coords.x, surroundingTiles.right.coords.y);
      }
      return surroundingTiles;
    };

    this.pathScope = {
      openList: [],
      closedList: [],
      goodPaths: [],
      finishedPath: [],
    };

    this.recursivePathIterations = 0;

    this.getTarget = function () {
      const targetPosition = new Coordinates(this.position.x, this.position.y);
      if (this.direction == 'left') {
        targetPosition.x -= 1;
        if (targetPosition.x < 0) {
          targetPosition.x = this.game.map.width - 1;
        }
      } else if (this.direction == 'right') {
        targetPosition.x += 1;
        if (targetPosition.x >= this.game.map.width) {
          targetPosition.x = 0;
        }
      } else if (this.direction == 'up') {
        targetPosition.y -= 1;
        if (targetPosition.y < 0) {
          targetPosition.y = this.game.map.height - 1;
        }
      } else if (this.direction == 'down') {
        targetPosition.y += 1;
        if (targetPosition.y >= this.game.map.height) {
          targetPosition.y = 0;
        }
      }
      return targetPosition;
    };

    this.clipping = true;
    this.movementAnimationSettings = { easing: 'linear', duration: 200 };

    this.canMove = function (coordinates) {
      const destination = (coordinates == null) ? this.getTarget() : coordinates;

      // Get all tile layers.
      const destinationTileType = this.game.map.getTileTypeByCoords(destination.x, destination.y);

      // Wall.
      if (destinationTileType === TileCodes.wall || destinationTileType === TileCodes.futureFloor) {
        return false;
      }

      // Disappearing red wall.
      if (destinationTileType === TileCodes.dRedBlockInactive && !this.game.redSwitch) {
        return false;
      }

      // Appearing red wall.
      if (destinationTileType === TileCodes.aRedBlockInactive && this.game.redSwitch) {
        return false;
      }

      // Disappearing yellow wall.
      if (destinationTileType === TileCodes.dYellowBlockInactive && !this.game.yellowSwitch) {
        return false;
      }

      // Appearing yellow wall.
      if (destinationTileType === TileCodes.aYellowBlockInactive && this.game.yellowSwitch) {
        return false;
      }

      // Disappearing green wall.
      if (destinationTileType === TileCodes.dGreenBlockInactive && !this.game.greenSwitch) {
        return false;
      }

      // Appearing green wall.
      if (destinationTileType === TileCodes.aGreenBlockInactive && this.game.greenSwitch) {
        return false;
      }

      // Brown toggle wall.
      if (destinationTileType === TileCodes.brownBlockInactive && this.game.brownSwitch) {
        return false;
      }

      // Brown toggle off wall.
      if (destinationTileType === TileCodes.brownBlockActive && !this.game.brownSwitch) {
        return false;
      }

      // Yellow Door.
      if (destinationTileType === TileCodes.yellowDoor) {
        // Player has key.
        return this.inventory.yellowKeys > 0;
      }

      // Red Door.
      if (destinationTileType === TileCodes.redDoor) {
        // Player has key.
        return this.inventory.redKeys > 0;
      }

      // Cyan Door.
      if (destinationTileType === TileCodes.cyanDoor) {
        // Player has key.
        return this.inventory.cyanKeys > 0;
      }

      // Green Door.
      if (destinationTileType === TileCodes.greenDoor) {
        // Player has key.
        return this.inventory.greenKeys > 0;
      }

      // Toll block.
      if (destinationTileType === TileCodes.toll) {
        // Player has the toll.
        return this.inventory.money >= this.game.moneyCount;
      }

      // Check pushblock.
      if (this.type === 'player' || this.type === 'enemy') {
        for (let i = 0; i < this.game.tools.length; i += 1) {
          if (this.game.tools[i].subType === 'pushBlock') {
            // Sprite is trying to move into pushblock.
            if (Utility.areColliding(destination, this.game.tools[i].position)) {
              // Only player can move pushblocks.
              if (this.type === 'player') {
                // If pushblock isn't stuck, will get pushed.
                this.game.tools[i].direction = this.direction;
                if (this.game.tools[i].canMove()) {
                  this.game.tools[i].gettingPushed = true;
                  return true;
                }
              }
              // Pushblock is stuck or sprite is not player.
              return false;
            }
          }
        }
      }

      // Pushblock recursive checkmove.

      if (this.subType === 'pushBlock') {
        for (let i = 0; i < this.game.tools.length; i += 1) {
          if (this.game.tools[i].subType === 'pushBlock') {
            if (Utility.areColliding(destination, this.game.tools[i].position)) {
              return false;
            }
          }
        }

        for (let i = 0; i < this.game.enemies.length; i += 1) {
          if (Utility.areColliding(destination, this.game.enemies[i].position)) {
            return false;
          }
        }
      }

      // All clear. Sprite can move.
      return true;
    };

    this.turn = function (direction) {
      this.direction = direction;
      this.rotation = this.getRotation();
    };

    this.getRotation = function () {
      switch (this.direction) {
        case 'up':
          return 0;
        case 'down':
          return 180;
        case 'left':
          return -90;
        case 'right':
          return 90;
        default:
          return;
      }
    };

    this.turnAround = function () {
      switch (this.direction) {
        case 'left':
          this.turn('right');
          break;
        case 'right':
          this.turn('left');
          break;
        case 'up':
          this.turn('down');
          break;
        case 'down':
          this.turn('up');
          break;
        default:
          break;
      }
    };

    this.turnAntiClockwise = function () {
      switch (this.direction) {
        case 'left':
          this.turn('down');
          break;
        case 'right':
          this.turn('up');
          break;
        case 'up':
          this.turn('left');
          break;
        case 'down':
          this.turn('right');
          break;
        default:
          break;
      }
    };

    this.turnProClockwise = function () {
      switch (this.direction) {
        case 'left':
          this.turn('up');
          break;
        case 'right':
          this.turn('down');
          break;
        case 'up':
          this.turn('right');
          break;
        case 'down':
          this.turn('left');
          break;
        default:
          break;
      }
    };

    this.goForward = function (d) {
      if (d != null) {
        this.turn(d);
      }
      if (!this.clipping || this.canMove()) {
        if (this.type === 'player') {
          this.game.quickCorruptTriggered = false;
        }
        this.position = this.getTarget();
        this.isTeleporting = false;
        this.checkTile();
      }
    };

    this.checkTile = function () {
      // var tileIndex = game.map.getTileIndexByCoords
      const tileType = this.game.map.getTileTypeByCoords(this.position.x, this.position.y);

      // Normal.
      if (tileType === TileCodes.floor) {
        return;
      }

      // Yellow Door.
      if (tileType === TileCodes.yellowDoor) {
        // Player has a key.
        if (this.inventory.yellowKeys > 0) {
          // Unlock door.
          this.game.map.changeTileType(this.position.x, this.position.y, TileCodes.floor);

          // Player has used key.
          this.inventory.yellowKeys -= 1;

          return true;
        }
        return false;
      }

      // Red Door.
      if (tileType === TileCodes.redDoor) {
        // Player has a key.
        if (this.inventory.redKeys > 0) {
          // Unlock door.
          this.game.map.changeTileType(this.position.x, this.position.y, TileCodes.floor);

          // Player has used key.
          this.inventory.redKeys -= 1;

          return true;
        }
        return false;
      }

      // Cyan Door.
      if (tileType === TileCodes.cyanDoor) {
        // Player has a key.
        if (this.inventory.cyanKeys > 0) {
          // Unlock door.
          this.game.map.changeTileType(this.position.x, this.position.y, TileCodes.floor);

          // Player has used key.
          this.inventory.cyanKeys -= 1;

          return true;
        }
        return false;
      }

      // Green Door.
      if (tileType === TileCodes.greenDoor) {
        // Player has a key.
        if (this.inventory.greenKeys > 0) {
          // Unlock door.
          this.game.map.changeTileType(this.position.x, this.position.y, TileCodes.floor);

          // Player has used key.
          this.inventory.greenKeys -= 1;

          return true;
        }
        return false;
      }

      // Exit.
      if (tileType === TileCodes.exit) {
        // Only player can trigger exit.
        if (this.type === 'player') {
          this.game.atExit = true;
        }
      }

      // Water & death.
      if (tileType === TileCodes.water) {
        // Balls are immune to water death.
        // if (this.subType != "ball") {

        this.isDead = true;

        if (this.type === 'player') {
          const message = Utility.array.getRandomElement(DeathMessages.water);
          this.game.setDeadMessage(message);
        }

        else if (this.type === 'enemy') {
          // game.enemies.remove(Utility.array.findByProperty(game.enemies, "spriteID", this.spriteID));
          this.destroy();
        }

        // Block hits water and disappears.
        else if (this.subType === 'pushBlock') {
          this.game.tools.remove(Utility.array.findByProperty(this.game.tools, 'spriteID', this.spriteID));
        }
        // }
      }
    };

    // Todo: move all of this to a separate file. This is outside the scope of sprites.
    this.GetInput = function () {
      const keyboard = this.keyboard;
      const keyIsDown = this.keyboard.keyIsDown;
      const keyIsRegistered = this.keyboard.keyIsRegistered;
      // Todo: Refactor these literals to constants defined in separate file.

      // Player is at title screen. Press enter to start.
      // Press X to enter password. No other input allowed except for konami code.
      if (this.game.mode === 'title') {
        // TODO: Change all (keyIsDown && !keyIsRegistered) calls into a control mapping function
        //       with a callback for when the event is true.
        if (keyIsDown.Enter && !keyIsRegistered.Enter) {
          keyIsRegistered.Enter = true;
          this.game.nextLevel();
        } else if ((keyIsDown.X && !keyIsRegistered.X) || (keyIsDown.x && !keyIsRegistered.x)) {
          keyIsRegistered.X = true;
          this.game.mode = 'password';
        } else if (keyboard.konamiCode()) {
          // :)
          this.game.mode = 'normal';
        }
        return;
      } else if (this.game.mode === 'password') {
        if (keyIsDown.Enter && !keyIsRegistered.Enter) {
          keyIsRegistered.Enter = true;

          this.passwordHandler.process();
        } else if (keyIsDown.Esc && !keyIsRegistered.Esc) {
          keyIsRegistered.Esc = true;
          this.game.passwordHudMessage = '';
          this.game.enteredPassword = '';
          this.game.mode = 'title';
        } else if (keyIsDown.Backspace && !keyIsRegistered.Backspace) {
          keyIsRegistered.Backspace = true;
          this.game.enteredPassword = this.game.enteredPassword.slice(0, -1);
        } else {
          // Get keyboard.alphanumeric input.
          for (let i = 0; i < keyboard.alphanumeric.length; i += 1) {
            const alphanumericTX = keyboard.alphanumericTX[i];
            if (keyIsDown[alphanumericTX] && !keyIsRegistered[alphanumericTX]) {
              keyboard.keyIsRegistered[alphanumericTX] = true;

              if (this.game.enteredPassword.length < this.maxPasswordLength) {
                this.game.enteredPassword += keyboard.alphanumeric[i];
              }
            }
          }
        }

        if (this.game.enteredPassword.length > 0) {
          this.game.passwordHudMessage = '';
        }
      } else if (this.game.mode === 'credits') {
        if (keyIsDown.Enter && !keyIsRegistered.Enter) {
          keyIsRegistered.Enter = true;

          // Hit enter once to skip credit fades. Hit it again to return to title.
          if (this.game.credits.sequence === 2) {
            this.game.returnToTitle();
          } else {
            this.game.credits.sequence = 2;
          }
        } else {
          return;
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
        if (this.player.isDead) {
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
          let stopCheck = false;

          stopCheck =
            this.executeInput('A', this.keyboardRepeatTickDelay, this.goForward, ['left']) ||
            this.executeInput('D', this.keyboardRepeatTickDelay, this.goForward, ['right']) ||
            this.executeInput('W', this.keyboardRepeatTickDelay, this.goForward, ['up']) ||
            this.executeInput('S', this.keyboardRepeatTickDelay, this.goForward, ['down']) ||
            this.executeInput('LEFT', this.keyboardRepeatTickDelay, this.goForward, ['left']) ||
            this.executeInput('RIGHT', this.keyboardRepeatTickDelay, this.goForward, ['right']) ||
            this.executeInput('UP', this.keyboardRepeatTickDelay, this.goForward, ['up']) ||
            this.executeInput('DOWN', this.keyboardRepeatTickDelay, this.goForward, ['down']);
          return;
        } else if (this.game.theEnd) {
          if (this.startCountup) {
            this.ticks += 1;

            // 20-tick delay.
            // TODO: Remove magic number.
            if (this.ticks > 20) {
              this.autoMove = true;
              // TODO: Remove magic number.
              if (this.game.gameTimer % 6 !== 0) {
                return;
              }
              this.turn('right');
              this.goForward();
            }
          }
        }
      }
    };

    this.executeInput = function executeInput(keyName, repeatDelay, callback, args) {
      const keyHeldDuration = this.keyboard.keyHeldDuration;
      if (this.keyboard.keyIsDown[keyName]) {
        if (keyHeldDuration[keyName] === 0 || keyHeldDuration[keyName] > repeatDelay) {
          // TODO: Remove magic number.
          if (keyHeldDuration[keyName] % 2 === 0) {
            callback.apply(this, args);
          }
        }
        keyHeldDuration[keyName] += 1;
        return true;
      }
      return false;
    };

    this.Update = function Update() {
      // TODO: Refactor out all sprite callbacks into separate file.
      //       Instantiate update functions upon load.
      if (!this.isAlive) {
        return false;
      }

      if (this.type === 'tool') {
        if (this.subType === 'pushBlock') {
          if (this.gettingPushed) {
            this.direction = this.player.direction;
            this.goForward();

            this.gettingPushed = false;
          }
        }
      }
      if (this.type === 'enemy') {
        // Enemy movement patterns.
        switch (this.subType) {

          case 'ball':
            // TODO: Remove magic number.
            if (this.game.gameTimer % 8 !== 0) {
              return false;
            }

            if (!this.canMove()) {
              this.turnAround();
            }

            this.goForward();

            break;

          case 'nascar':
            // TODO: Remove magic number.
            if (this.game.gameTimer % 8 !== 0) {
              return false;
            }

            if (!this.canMove()) {
              this.turnAntiClockwise();
            }

            this.goForward();
            break;

          case 'britishNascar':
            // TODO: Remove magic number.
            if (this.game.gameTimer % 8 !== 0) {
              return false;
            }

            if (!this.canMove()) {
              this.turnProClockwise();
            }

            this.goForward();
            break;

          case 'gronpree':
            /* Gronpree:
            Move forward until hit obstacle.

            In event of obstacle:
            Try turning clockwise, then counter clockwise, then going in reverse.

            In event of next obstacle:
            Try turning counterclockwise, then clockwise, then going in reverse.

            Switch back and forth between counterclockwise
              and clockwise preference on every obstacle encountered.

            TODO: Remove magic number.
            */
            if (this.game.gameTimer % 8 !== 0) {
              return false;
            }

            if (!this.canMove()) {
              if (!this.isPreferringClockwise) {
                this.turnAntiClockwise();
                if (!this.canMove()) {
                  this.turnAround();
                  if (!this.canMove()) {
                    this.turnProClockwise();
                  }
                } else {
                  this.isPreferringClockwise = this.isPreferringClockwise.toggle();
                }
              } else {
                this.turnProClockwise();
                if (!this.canMove()) {
                  this.turnAround();
                  if (!this.canMove()) {
                    this.turnAntiClockwise();
                  }
                } else {
                  this.isPreferringClockwise = this.isPreferringClockwise.toggle();
                }
              }
            }

            this.goForward();
            break;

          case 'predator':
            // Try to close distance to player by means of an absolute direct path,
            // regardless of obstacles.
            // TODO: Remove magic number.
            if (this.game.gameTimer % 8 !== 0) {
              return false;
            }

            this.movePredator();
            break;

          case 'smartPredator':
            if (this.game.gameTimer % this.speed !== 0) {
              return false;
            }
            this.movePredator();
            break;

          case 'berzerker':
            // TODO: Remove magic number.
            if (this.game.gameTimer % 8 !== 0) {
              return false;
            }

            if (this.position.x === this.player.position.x) {
              if (this.position.y > this.player.position.y) {
                this.turn('up');
              } else {
                this.turn('down');
              }
            } else if (this.position.y === this.player.position.y) {
              if (this.position.x > this.player.position.x) {
                this.turn('left');
              } else {
                this.turn('right');
              }
            }

            if (!this.canMove()) {
              this.turnAntiClockwise();
            }

            this.goForward();
            break;

          case 'player2':
            if (this.startCountup) {
              this.ticks += 1;

              // 20-tick delay.
              if (this.ticks > 20) {
                this.autoMove = true;
                if (!this.autoMove) {
                  break;
                }

                if (this.game.gameTimer % 4 !== 0) {
                  return false;
                }

                this.turn('right');
                this.goForward();
              }
            }
            // TODO: Refactor The End into its own class.
            if (this.startTheEnd) {
              this.ticks += 1;

              if (this.position.y === 9 && this.position.x > 5) {
                this.player.rotation = 0;
                if (this.game.gameTimer % 40 !== 0) {
                  return false;
                }
                this.turn('left');
                this.goForward();
              } else if (this.position.y === 9 && this.position.x > 4) {
                if (this.game.gameTimer % 200 !== 0) {
                  return false;
                }
                this.turn('left');
                this.goForward();
              } else if (this.position.y === 9 && this.position.x > 3) {
                if (this.game.gameTimer % 100 !== 0) {
                  return false;
                }
                this.turn('left');
                this.goForward();
              } else if (this.position.y > 6) {
                if (this.game.gameTimer % 40 !== 0) {
                  return false;
                }
                this.turn('up');
                this.goForward();
              } else if (this.position.x < 4) {
                if (this.game.gameTimer % 40 !== 0) {
                  return false;
                }
                this.turn('right');
                this.goForward();
              } else if (this.position.x < 5) {
                if (this.game.gameTimer % 100 !== 0) {
                  return false;
                }
                this.turn('right');
                this.goForward();
              } else {
                this.player.startCountup = true;
              }
            }
            break;

          default:
            break;
        } // switch(this.subType)
      }
    };

    this.movePredator = function movePredator() {
      const xDist = Math.abs(this.position.x - this.player.position.x);
      const yDist = Math.abs(this.position.y - this.player.position.y);

      if (xDist > yDist) {
        if (this.position.x > this.player.position.x) {
          this.turn('left');
        } else {
          this.turn('right');
        }
        if (!this.canMove()) {
          if (this.position.y > this.player.position.y) {
            this.turn('up');
          } else if (this.position.y < this.player.position.y) {
            this.turn('down');
          }
        }
      } else {
        if (this.position.y > this.player.position.y) {
          this.turn('up');
        } else {
          this.turn('down');
        }
        if (!this.canMove()) {
          if (this.position.x > this.player.position.x) {
            this.turn('left');
          } else if (this.position.x < this.player.position.x) {
            this.turn('right');
          }
        }
      }
      this.goForward();
    };

    // Crush check.
    // Only applies to player.
    this.crushCheck = function crushCheck() {
      if (this.type === 'player' && !this.canMove(this.position)) {
        this.isDead = true;
        const message = Utility.array.getRandomElement(DeathMessages.crush);
        this.game.setDeadMessage(message);
      }
    };

    this.registerHit = function registerHit(s) {
      const sprite = s;
      if (!this.isAlive) {
        return false;
      }

      if (this.subType === 'switch') {
        if (this.color === 'red') {
          this.game.redSwitch = true;
        }
        if (this.color === 'yellow') {
          this.game.yellowSwitch = true;
        }
        if (this.color === 'green') {
          this.game.greenSwitch = true;
        }

        if (this.color === 'brown' && !this.game.brownSwitch) {
          this.game.brownSwitch = true;
        }

        if (this.color === 'brownOff' && this.game.brownSwitch) {
          this.game.brownSwitch = false;
        }
      }

      if (this.subType === 'yellowKey') {
        // If player or predator enemy, can pick up key.
        if (sprite.type === 'player' || sprite.subType === 'predator' || sprite.subType === 'smartPredator') {
          // Player gains key.
          sprite.inventory.yellowKeys += 1;

          // Remove key from map.
          Utility.array.removeBySpriteId(this.game.items, this.spriteID);
        }
      }

      if (this.subType === 'redKey') {
        // If player or predator enemy, can pick up key.
        if (sprite.type === 'player' || sprite.subType === 'predator' || sprite.subType === 'smartPredator') {
          // Player gains key.
          sprite.inventory.redKeys += 1;

          // Remove key from map.
          Utility.array.removeBySpriteId(this.game.items, this.spriteID);
        }
      }

      if (this.subType === 'cyanKey') {
        // If player or predator enemy, can pick up key.
        if (sprite.type === 'player' || sprite.subType === 'predator' || sprite.subType === 'smartPredator') {
          // Player gains key.
          sprite.inventory.cyanKeys += 1;

          // Remove key from map.
          Utility.array.removeBySpriteId(this.game.items, this.spriteID);
        }
      }

      if (this.subType === 'greenKey') {
        // If player or predator enemy, can pick up key.
        if (sprite.type === 'player' || sprite.subType === 'predator' || sprite.subType === 'smartPredator') {
          // Player gains key.
          sprite.inventory.greenKeys += 1;

          // Remove key from map.
          Utility.array.removeBySpriteId(this.game.items, this.spriteID);
        }
      }

      if (this.subType === 'help' || this.subType === 'help2') {
        if (sprite.type === 'player') {
          this.game.showMessage = true;
          this.game.messageText = this.message;
        }
      }

      if (this.subType === 'money') {
        if (sprite.type === 'player') {
          // Player gains money.
          sprite.inventory.money += 1;

          // Remove money from map.
          Utility.array.removeBySpriteId(this.game.items, this.spriteID);
        }
      }

      if (this.subType === 'teleporter') {
        if (!sprite.isTeleporting) {
          if (this.destination != null) {
            const destinationTeleporter = Utility.array.findByProperty(this.game.items, 'nameID', this.destination);
            sprite.position = destinationTeleporter.position;
            sprite.isTeleporting = true;
          }
        }
      }

      // Can of worms, here.
      if (this.subType === 'hiddenSwitch') {
        let p2;
        let thePredator;
        switch (this.callback) {

          case 'corrupt':
            this.game.incrementCorruption = true;
            this.game.corruption = 1;
            this.game.corruptionTimer = 50;

            break;

          case 'quickCorrupt':
            if (!this.game.quickCorruptTriggered) {
              this.game.onQuickCorruptTile = true;
              this.game.quickCorruptTriggered = true;
              this.game.corruption = 1;
              this.game.corruptionTimer = 20;
            }
            break;

          case 'revenge':
            if (this.game.debug) {
              Utility.console.log('revenge');
            }
            thePredator = Utility.array.findByProperty(this.game.enemies, 'subType', 'predator');
            thePredator.subType = 'nascar';

            p2 = Utility.array.findByProperty(this.game.enemies, 'subType', 'player2');
            p2.startCountup = true;

            break;

          case 'theEnd':
            if (this.game.debug) {
              Utility.console.log('the end');
            }
            thePredator = Utility.array.findByProperty(this.game.enemies, 'subType', 'predator');
            thePredator.subType = 'nascar';

            p2 = Utility.array.findByProperty(this.game.enemies, 'subType', 'player2');
            p2.startTheEnd = true;
            this.game.theEnd = true;

            break;
          case 'transform':
            if (this.game.debug) {
              Utility.console.log('transform');
            }
            thePredator = Utility.array.findByProperty(this.game.enemies, 'subType', 'predator');
            thePredator.subType = 'smartPredator';
            thePredator.tileGraphic = TileCodes.smartPredator;
            thePredator.speed = 3;
            this.game.brownSwitch = this.game.brownSwitch.toggle();
            break;
          case 'destroyPredator':
            if (this.game.debug) {
              Utility.console.log('destroy predator');
            }
            thePredator = Utility.array.findByProperty(this.game.enemies, 'subType', 'smartPredator');
            thePredator.destroy();
            break;
          default:
            break;
        }

        // One-time use, then erase item from map.
        if (this.destroyOnUse) {
          this.destroy();
        }
      }
      return false;
    };

    this.Draw = function drawSprite() {
      const ctx = this.draw.ctx;

      if (!this.isAlive) {
        return false;
      }
      let sign = 1;

      if (this.type === 'player') {
        ctx.save();
        const offsetX = this.halfBaseUnit + this.stage.drawOffset.x;
        const offsetY = this.halfBaseUnit + this.stage.drawOffset.y;
        ctx.translate(
          (this.position.x * this.baseUnit) + offsetX,
          (this.position.y * this.baseUnit) + offsetY
        );
        ctx.rotate(Utility.math.toRadians(this.rotation));
        if (this.imageType === 'image') {
          ctx.drawImage(this.image, -this.halfBaseUnit, -this.halfBaseUnit);
        }
        ctx.restore();
      } else if (this.type === 'enemy' || this.type === 'item' || this.type === 'tool') {
        let tileNumber = this.tileGraphic;

        // Don't draw hidden switches.
        if (this.subType === 'hiddenSwitch' && !this.game.debug) {
          return false;
        }
        if (this.subType === 'teleporter') {
          // Teleporter animation.
          tileNumber += Math.floor((this.game.gameTimer % 9) / 3);
        } else if (this.game.brownSwitch && this.subType === 'switch') {
          // Draw switch toggling.
          if (this.color === 'brown') {
            tileNumber -= 1;
          } else if (this.color === 'brownOff') {
            tileNumber += 1;
          }
        }

        // Corrupt false tiles in opposite direction.
        if (this.subType === 'wall' || this.subType === 'water' || this.subType === 'exit' || this.subType === 'futureWall') {
          sign = -1;
        }

        const coords = this.position;

        if (this.subType === 'player2') {
          ctx.save();
          const translateX = (this.position.x * this.baseUnit)
            + this.halfBaseUnit + this.stage.drawOffset.x;
          const translateY = (this.position.y * this.baseUnit)
            + this.halfBaseUnit + this.stage.drawOffset.y;
          ctx.translate(translateX, translateY);
          ctx.rotate(Utility.math.toRadians(this.rotation));

          ctx.drawImage(this.player.image, -this.halfBaseUnit, -this.halfBaseUnit);

          ctx.restore();
        } else {
          this.draw.drawTileOffset(tileNumber, coords, sign);
        }
      }
      return false;
    };

    this.destroy = function destroy() {
      let pool = null;
      switch (this.type) {

        case 'enemy':
          // pool = game.enemies;
          this.isAlive = false;
          return;

        case 'item':
          pool = this.game.items;
          break;

        case 'tool':
          pool = this.game.tools;
          break;

        default:
          break;
      }
      pool.remove(Utility.array.findByProperty(pool, 'spriteID', this.spriteID));
    };
  };

  return SpriteNS;
});
