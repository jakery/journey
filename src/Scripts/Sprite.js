// / <reference path="../jquery.keyboard.js" />

if (typeof baseUnit == 'undefined') {
  var baseUnit = 32;
}


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


function tileDistanceBetween(coords1, coords2) {
  const xDist = Math.abs(coords1.x - coords2.x);
  const yDist = Math.abs(coords1.y - coords2.y);
  return xDist + yDist;
}

function areSpritesColliding(s1, s2) {
  return areColliding(s1.position, s2.position);
}

function areColliding(pos1, pos2) {
  return pos1.x == pos2.x && pos1.y == pos2.y;
}


SpriteNS.Sprite = function () {
  this.isAlive = true;

  this.spriteID = null;
  this.nameID = '';
  this.travelableLayer = 'travelableTiles';
  this.inventory = new SpriteNS.Inventory();
  this.customVariables = {};
  this.verticalOffset = baseUnit * 1;
  this.horizontalOffset = baseUnit * 0;
  this.width = baseUnit * 1;
  this.height = baseUnit * 2;
  this.image;
  this.tileGraphic;
  this.speed;

  this.callback = null;
  this.destroyOnUse = false;

  this.isDead = false;
  this.hasKilledPlayer = false;

  this.visible = true;

  this.isPreferringClockwise = false;

  this.type = '';
  this.subType = '';

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
    // this.interaction = [new Interaction("dialog","<default>")];

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
    return tileDistanceBetween(this.position, sprite.position);
  };


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
    if (game.map.isInBounds(surroundingTiles.up.coords)) {
      surroundingTiles.up.type = game.map.getTileTypeByCoords(surroundingTiles.up.coords.x, surroundingTiles.up.coords.y);
    }
    if (game.map.isInBounds(surroundingTiles.down.coords)) {
      surroundingTiles.down.type = game.map.getTileTypeByCoords(surroundingTiles.down.coords.x, surroundingTiles.down.coords.y);
    }
    if (game.map.isInBounds(surroundingTiles.left.coords)) {
      surroundingTiles.left.type = game.map.getTileTypeByCoords(surroundingTiles.left.coords.x, surroundingTiles.left.coords.y);
    }
    if (game.map.isInBounds(surroundingTiles.right.coords)) {
      surroundingTiles.right.type = game.map.getTileTypeByCoords(surroundingTiles.right.coords.x, surroundingTiles.right.coords.y);
    }
    return surroundingTiles;
  };

  this.surroundingTiles;


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
        targetPosition.x = game.map.width - 1;
      }
    } else if (this.direction == 'right') {
      targetPosition.x += 1;
      if (targetPosition.x >= game.map.width) {
        targetPosition.x = 0;
      }
    } else if (this.direction == 'up') {
      targetPosition.y -= 1;
      if (targetPosition.y < 0) {
        targetPosition.y = game.map.height - 1;
      }
    } else if (this.direction == 'down') {
      targetPosition.y += 1;
      if (targetPosition.y >= game.map.height) {
        targetPosition.y = 0;
      }
    }
    return targetPosition;
  };

  this.clipping = true;
  this.movementAnimationSettings = { easing: 'linear', duration: 200 };

  this.canMove = function (coordinates) {
    if (coordinates == null) {
      var destination = this.getTarget();
    } else {
      var destination = coordinates;
    }


        // Get all tile layers.

    const destinationTileType = game.map.getTileTypeByCoords(destination.x, destination.y);


        // Water check. (For smartPredators only)
        // if (this.subType == "smartPredator") {
        //    if (destinationTileType == 20) {
        //        return false;
        //    }
        // }

        // Wall.
    if (destinationTileType == 2 || destinationTileType == tileCodes.futureFloor) {
      return false;
    }

        // Disappearing red wall.
    if (destinationTileType == 17 && !game.redSwitch) {
      return false;
    }

        // Appearing red wall.
    if (destinationTileType == 23 && game.redSwitch) {
      return false;
    }

        // Disappearing yellow wall.
    if (destinationTileType == 29 && !game.yellowSwitch) {
      return false;
    }

        // Appearing yellow wall.
    if (destinationTileType == 35 && game.yellowSwitch) {
      return false;
    }

        // Disappearing green wall.
    if (destinationTileType == 41 && !game.greenSwitch) {
      return false;
    }

        // Appearing green wall.
    if (destinationTileType == 47 && game.greenSwitch) {
      return false;
    }


        // Brown toggle wall.
    if (destinationTileType == 53 && game.brownSwitch) {
      return false;
    }

        // Brown toggle off wall.
    if (destinationTileType == 54 && !game.brownSwitch) {
      return false;
    }

        // Yellow Door.
    if (destinationTileType == 3) {
            // Player has key.
      if (this.inventory.yellowKeys > 0) {
        return true;
      } else {
        return false;
      }
    }

        // Red Door.
    if (destinationTileType == 21) {
            // Player has key.
      if (this.inventory.redKeys > 0) {
        return true;
      } else {
        return false;
      }
    }

        // Cyan Door.
    if (destinationTileType == 33) {
            // Player has key.
      if (this.inventory.cyanKeys > 0) {
        return true;
      } else {
        return false;
      }
    }

        // Green Door.
    if (destinationTileType == 45) {
            // Player has key.
      if (this.inventory.greenKeys > 0) {
        return true;
      } else {
        return false;
      }
    }

        // Toll block.
    if (destinationTileType == 13) {
            // Player has the toll.
      if (this.inventory.money >= game.moneyCount) {
        return true;
      } else {
        return false;
      }
    }

        // Check pushblock.
    if (this.type == 'player' || this.type == 'enemy') {
      for (var i = 0; i < game.tools.length; i++) {
        if (game.tools[i].subType == 'pushBlock') {
                    // Sprite is trying to move into pushblock.
          if (areColliding(destination, game.tools[i].position)) {
                        // Only player can move pushblocks.
            if (this.type == 'player') {
                            // If pushblock isn't stuck, will get pushed.
              game.tools[i].direction = this.direction;
              if (game.tools[i].canMove()) {
                game.tools[i].gettingPushed = true;
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

    if (this.subType == 'pushBlock') {
      for (var i = 0; i < game.tools.length; i++) {
        if (game.tools[i].subType == 'pushBlock') {
          if (areColliding(destination, game.tools[i].position)) {
            return false;
          }
        }
      }

      for (var i = 0; i < game.enemies.length; i++) {
        if (areColliding(destination, game.enemies[i].position)) {
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
        break;
      case 'down':
        return 180;
        break;
      case 'left':
        return -90;
        break;
      case 'right':
        return 90;
        break;
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
    }
  };

  this.goForward = function (d) {
    if (d != null) {
      this.turn(d);
    }


    if (!this.clipping || this.canMove()) {
      if (this.type == 'player') {
        game.quickCorruptTriggered = false;
      }

      this.position = this.getTarget();

      this.isTeleporting = false;
      this.checkTile();
    }
        // Walk backwards.
        // if (this.backwards) { this.turnAround(); }


        //        switch (this.direction) {
        //            case "left":
        //                this.goLeft();
        //                break;
        //            case "right":
        //                this.goRight();
        //                break;
        //            case "up":
        //                this.goUp();
        //                break;
        //            case "down":
        //                this.goDown();
        //                break;
        //        }
  };


  this.checkTile = function () {
        // var tileIndex = game.map.getTileIndexByCoords
    const tileType = game.map.getTileTypeByCoords(this.position.x, this.position.y);


        // Normal.
    if (tileType == 1) {
      return;
    }


        // Yellow Door.
    if (tileType == 3) {
            // Player has a key.
      if (this.inventory.yellowKeys > 0) {
                // Unlock door.
        game.map.changeTileType(this.position.x, this.position.y, 1);

                // Player has used key.
        this.inventory.yellowKeys -= 1;

        return true;
      } else {
        return false;
      }
    }

        // Red Door.
    if (tileType == 21) {
            // Player has a key.
      if (this.inventory.redKeys > 0) {
                // Unlock door.
        game.map.changeTileType(this.position.x, this.position.y, 1);

                // Player has used key.
        this.inventory.redKeys -= 1;

        return true;
      } else {
        return false;
      }
    }


        // Cyan Door.
    if (tileType == 33) {
            // Player has a key.
      if (this.inventory.cyanKeys > 0) {
                // Unlock door.
        game.map.changeTileType(this.position.x, this.position.y, 1);

                // Player has used key.
        this.inventory.cyanKeys -= 1;

        return true;
      } else {
        return false;
      }
    }


        // Cyan Door.
    if (tileType == 45) {
            // Player has a key.
      if (this.inventory.greenKeys > 0) {
                // Unlock door.
        game.map.changeTileType(this.position.x, this.position.y, 1);

                // Player has used key.
        this.inventory.greenKeys -= 1;

        return true;
      } else {
        return false;
      }
    }


        // Exit.
    if (tileType == 6) {
            // Only player can trigger exit.
      if (this.type == 'player') {
        game.atExit = true;
      }
    }

        // Water & death.
    if (tileType == 20) {
            // Balls are immune to water death.
            // if (this.subType != "ball") {


      this.isDead = true;

      if (this.type == 'player') {
        const message = randomMessages.water.getRandomElement();
        game.setDeadMessage(message);
      }

      else if (this.type == 'enemy') {
                    // game.enemies.remove(game.enemies.findByProperty("spriteID", this.spriteID));
        this.destroy();
      }

                // Block hits water and disappears.
      else if (this.subType == 'pushBlock') {
        game.tools.remove(game.tools.findByProperty('spriteID', this.spriteID));
      }
            // }
    }
  };


    //    this.advanceWalkingFrame = function () {

    //        var newFrame = this.animationFrame + this.animationDirection;

    //        if (newFrame > 2 || newFrame < 0) {
    //            this.animationDirection *= -1;
    //            var newFrame = this.animationFrame + this.animationDirection;
    //            var newFrame = this.animationFrame + this.animationDirection;
    //        }
    //        this.animationFrame = newFrame;
    //        this.displayBox.removeClass("frame0 frame1 frame2");
    //        this.displayBox.addClass("frame" + this.animationFrame);
    //    }


    // Todo: move all of this to a separate file. Not all sprites should have this.

  this.GetInput = function () {
        // Todo: refactor these conditionals to "game.mode".


        // Player is at title screen. Press enter to start. Press X to enter password. No other input allowed except for konami code.
    if (game.mode == 'title') {
      if (keyIsDown.Enter && !keyIsRegistered.Enter) {
        keyIsRegistered.Enter = true;
        game.nextLevel();
      } else if ((keyIsDown.X && !keyIsRegistered.X) || (keyIsDown.x && !keyIsRegistered.x)) {
        keyIsRegistered.X = true;
        game.mode = 'password';
      }

      else {
                // :)
        if (konamiCode()) {
          game.mode = 'normal';
        }
      }

      return;
    } else if (game.mode == 'password') {
      if (keyIsDown.Enter && !keyIsRegistered.Enter) {
        keyIsRegistered.Enter = true;

        processPassword();
      } else if (keyIsDown.Esc && !keyIsRegistered.Esc) {
        keyIsRegistered.Esc = true;
        game.passwordHudMessage = '';
        enteredPassword = '';
        game.mode = 'title';
      } else if (keyIsDown.Backspace && !keyIsRegistered.Backspace) {
        keyIsRegistered.Backspace = true;
        enteredPassword = enteredPassword.slice(0, -1);
      }


      else {
                // Get alphanumeric input.
        for (let i = 0; i < alphanumeric.length; i++) {
          if (keyIsDown[alphanumericTX[i]] && !keyIsRegistered[alphanumericTX[i]]) {
            keyIsRegistered[alphanumericTX[i]] = true;

            if (enteredPassword.length < 11) {
              enteredPassword += alphanumeric[i];
            }
          }
        }
      }

      if (enteredPassword.length > 0) {
        game.passwordHudMessage = '';
      }
    } else if (game.mode == 'credits') {
      if (keyIsDown.Enter && !keyIsRegistered.Enter) {
        keyIsRegistered.Enter = true;


                    // Hit enter once to skip credit fades. Hit it again to return to title.
        if (game.credits.sequence == 2) {
          game.returnToTitle();
        } else {
          game.credits.sequence = 2;
        }
      }

      else {
        return;
      }
    }

    else {
        // Player is at exit. Press enter to continue. No other input allowed.
      if (game.atExit) {
            // If the game is perma-corrupted, you can't manually advance to the next level.
        if (!game.incrementCorruption && !game.theEnd) {
          if (keyIsDown.Enter && !keyIsRegistered.Enter) {
            keyIsRegistered.Enter = true;
            game.nextLevel();
          }
        }


        return;
      }

        // Player is dead. Press enter to restart. No other input allowed.
      if (player.isDead) {
        if (keyIsDown.Enter && !keyIsRegistered.Enter) {
          keyIsRegistered.Enter = true;
          game.restartLevel();
        }
        return;
      }


        // Game paused. Press enter to restart. May also press "P" to unpause game.
      if (game.isPaused) {
        if (keyIsDown.Enter && !keyIsRegistered.Enter) {
          keyIsRegistered.Enter = true;
          game.restartLevel();
          return;
        }
      }


        // Pause or unpause game.
      if (keyIsDown.P && !keyIsRegistered.P) {
        keyIsRegistered.P = true;
        game.isPaused = game.isPaused.toggle();
      }

      if (!game.isPaused && !game.theEnd) {
            // Next level for debug purposes.
        if (game.betaTest) {
          if (keyIsDown.N && !keyIsRegistered.N) {
            keyIsRegistered.N = true;
            game.nextLevel();
          }
        }


            // Execute "goForward" movement from first key to return true.
        let stopCheck = false;

        stopCheck =
                this.checkInputAndExecute('A', 10, this.goForward, ['left']) ||
                this.checkInputAndExecute('D', 10, this.goForward, ['right']) ||
                this.checkInputAndExecute('W', 10, this.goForward, ['up']) ||
                this.checkInputAndExecute('S', 10, this.goForward, ['down']) ||
                this.checkInputAndExecute('LEFT', 10, this.goForward, ['left']) ||
                this.checkInputAndExecute('RIGHT', 10, this.goForward, ['right']) ||
                this.checkInputAndExecute('UP', 10, this.goForward, ['up']) ||
                this.checkInputAndExecute('DOWN', 10, this.goForward, ['down']);
      }

      else if (game.theEnd) {
        if (this.startCountup) {
          this.ticks += 1;

                    // 20-tick delay.
          if (this.ticks > 20) {
            this.autoMove = true;

            if (game.gameTimer % 6 != 0) {
              return;
            }

            this.turn('right');
            this.goForward();
          }
        }
      }
    }
  };


  this.checkInputAndExecute = function (keyName, repeatDelay, callback, args) {
    if (keyIsDown[keyName]) {
      if (keyHeldDuration[keyName] == 0 || keyHeldDuration[keyName] > repeatDelay) {
        if (keyHeldDuration[keyName] % 2 == 0) {
          callback.apply(this, args);
        }
      }
      keyHeldDuration[keyName] += 1;
      return true;
    }
    return false;
  };


  this.Update = function () {
    if (!this.isAlive) {
      return false;
    }

    if (this.type == 'tool') {
      if (this.subType == 'pushBlock') {
        if (this.gettingPushed) {
          this.direction = player.direction;
          this.goForward();

          this.gettingPushed = false;
        }
      }
    }
    if (this.type == 'enemy') {
            // Auto move patterns.

      switch (this.subType) {


        case 'ball':
          if (game.gameTimer % 8 != 0) {
            return;
          }

          if (!this.canMove()) {
            this.turnAround();
          }

          this.goForward();

          break;


        case 'nascar':
          if (game.gameTimer % 8 != 0) {
            return;
          }

          if (!this.canMove()) {
            this.turnAntiClockwise();
          }

          this.goForward();
          break;

        case 'britishNascar':
          if (game.gameTimer % 8 != 0) {
            return;
          }

          if (!this.canMove()) {
            this.turnProClockwise();
          }

          this.goForward();
          break;

                // Gronpree:
                // Move forward until hit obstacle.
                //
                // In event of obstacle:
                // Try turning clockwise, then counter clockwise, then going in reverse.
                //
                // In event of next obstacle:
                // Try turning counterclockwise, then clockwise, then going in reverse.
                //
                // Switch back and forth between counterclockwise and clockwise preference on every obstacle encountered.

        case 'gronpree':
          if (game.gameTimer % 8 != 0) {
            return;
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


                // Try to close distance to player by means of an absolute direct path,
                // regardless of obstacles.
        case 'predator':

          if (game.gameTimer % 8 != 0) {
            return;
          }

          this.movePredator();
          break;

        case 'smartPredator':
          if (game.gameTimer % this.speed != 0) {
            return;
          }
          this.movePredator();
          break;

                // Find most efficient path around obstacles to close distance to player.
                // case "player2":
                    // if (game.gameTimer % 8 != 0) {
                    //    return;
                    // }

                    // this.goForward();

                    // break;

        case 'berzerker':
          if (game.gameTimer % 8 != 0) {
            return;
          }

          if (this.position.x == player.position.x) {
            if (this.position.y > player.position.y) {
              this.turn('up');
            } else {
              this.turn('down');
            }
          } else if (this.position.y == player.position.y) {
            if (this.position.x > player.position.x) {
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

              if (game.gameTimer % 4 != 0) {
                return;
              }

              this.turn('right');
              this.goForward();
            }
          }
          if (this.startTheEnd) {
            this.ticks += 1;

            if (this.position.y == 9 && this.position.x > 5) {
              player.rotation = 0;
              if (game.gameTimer % 40 != 0) {
                return;
              }
              this.turn('left');
              this.goForward();
            } else if (this.position.y == 9 && this.position.x > 4) {
              if (game.gameTimer % 200 != 0) {
                return;
              }
              this.turn('left');
              this.goForward();
            } else if (this.position.y == 9 && this.position.x > 3) {
              if (game.gameTimer % 100 != 0) {
                return;
              }
              this.turn('left');
              this.goForward();
            }


            else if (this.position.y > 6) {
//                            this.autoMove = true;
//                            if (!this.autoMove) {
//                                break;
//                            }

              if (game.gameTimer % 40 != 0) {
                return;
              }

              this.turn('up');
              this.goForward();
            } else if (this.position.x < 4) {
              if (game.gameTimer % 40 != 0) {
                return;
              }
              this.turn('right');
              this.goForward();
            } else if (this.position.x < 5) {
              if (game.gameTimer % 100 != 0) {
                return;
              }
              this.turn('right');
              this.goForward();
            } else {
              player.startCountup = true;
            }
          }
          break;
      } // switch(this.subType)
    }
  };

  this.movePredator = function () {
    const xDist = Math.abs(this.position.x - player.position.x);
    const yDist = Math.abs(this.position.y - player.position.y);

    if (xDist > yDist) {
      if (this.position.x > player.position.x) {
        this.turn('left');
      } else {
        this.turn('right');
      }
      if (!this.canMove()) {
        if (this.position.y > player.position.y) {
          this.turn('up');
        } else if (this.position.y < player.position.y) {
          this.turn('down');
        }
      }
    } else {
      if (this.position.y > player.position.y) {
        this.turn('up');
      } else {
        this.turn('down');
      }
      if (!this.canMove()) {
        if (this.position.x > player.position.x) {
          this.turn('left');
        } else if (this.position.x < player.position.x) {
          this.turn('right');
        }
      }
    }

    this.goForward();
  };

    // Crush check.
        // Only applies to player.
  this.crushCheck = function () {
    if (this.type == 'player' && !this.canMove(this.position)) {
      this.isDead = true;
      const message = randomMessages.crush.getRandomElement();
      game.setDeadMessage(message);
    }
  };

  this.registerHit = function (sprite) {
    if (!this.isAlive) {
      return false;
    }

    if (this.subType == 'switch') {
      if (this.color == 'red') {
        game.redSwitch = true;
      }
      if (this.color == 'yellow') {
        game.yellowSwitch = true;
      }
      if (this.color == 'green') {
        game.greenSwitch = true;
      }

      if (this.color == 'brown' && !game.brownSwitch) {
        game.brownSwitch = true;
      }

      if (this.color == 'brownOff' && game.brownSwitch) {
        game.brownSwitch = false;
      }
    }


    if (this.subType == 'yellowKey') {
            // If player or predator enemy, can pick up key.
      if (sprite.type == 'player' || sprite.subType == 'predator' || sprite.subType == 'smartPredator') {
                // Player gains key.
        sprite.inventory.yellowKeys += 1;

                // Remove key from map.
        game.items.remove(game.items.findByProperty('spriteID', this.spriteID));
      }
    }


    if (this.subType == 'redKey') {
            // If player or predator enemy, can pick up key.
      if (sprite.type == 'player' || sprite.subType == 'predator' || sprite.subType == 'smartPredator') {
                // Player gains key.
        sprite.inventory.redKeys += 1;

                // Remove key from map.
        game.items.remove(game.items.findByProperty('spriteID', this.spriteID));
      }
    }


    if (this.subType == 'cyanKey') {
            // If player or predator enemy, can pick up key.
      if (sprite.type == 'player' || sprite.subType == 'predator' || sprite.subType == 'smartPredator') {
                // Player gains key.
        sprite.inventory.cyanKeys += 1;

                // Remove key from map.
        game.items.remove(game.items.findByProperty('spriteID', this.spriteID));
      }
    }


    if (this.subType == 'greenKey') {
            // If player or predator enemy, can pick up key.
      if (sprite.type == 'player' || sprite.subType == 'predator' || sprite.subType == 'smartPredator') {
                // Player gains key.
        sprite.inventory.greenKeys += 1;

                // Remove key from map.
        game.items.remove(game.items.findByProperty('spriteID', this.spriteID));
      }
    }


    if (this.subType == 'help' || this.subType == 'help2') {
      if (sprite.type == 'player') {
        game.showMessage = true;
        game.messageText = this.message;
      }
    }

    if (this.subType == 'money') {
      if (sprite.type == 'player') {
                // Player gains money.
        sprite.inventory.money += 1;

                // Remove money from map.
        game.items.remove(game.items.findByProperty('spriteID', this.spriteID));
      }
    }

    if (this.subType == 'teleporter') {
      if (!sprite.isTeleporting) {
        if (this.destination != null) {
          const destinationTeleporter = game.items.findByProperty('nameID', this.destination);
          sprite.position = destinationTeleporter.position;
          sprite.isTeleporting = true;
        }
      }
    }


        // Can of worms, here.
    if (this.subType == 'hiddenSwitch') {
      switch (this.callback) {

        case 'corrupt':
          game.incrementCorruption = true;
          game.corruption = 1;
          game.corruptionTimer = 50;

          break;

        case 'quickCorrupt':
          if (!game.quickCorruptTriggered) {
            game.onQuickCorruptTile = true;
            game.quickCorruptTriggered = true;
            game.corruption = 1;
            game.corruptionTimer = 20;
          }
          break;


        case 'revenge':
          if (game.debug) {
            console.log('revenge');
          }
          game.enemies.findByProperty('subType', 'predator').subType = 'nascar';

          var p2 = game.enemies.findByProperty('subType', 'player2');
          p2.startCountup = true;

          break;

        case 'theEnd':
          if (game.debug) {
            console.log('the end');
          }
          game.enemies.findByProperty('subType', 'predator').subType = 'nascar';

          var p2 = game.enemies.findByProperty('subType', 'player2');
          p2.startTheEnd = true;
          game.theEnd = true;

          break;
        case 'transform':
          if (game.debug) {
            console.log('transform');
          }
          var thePredator = game.enemies.findByProperty('subType', 'predator');
          thePredator.subType = 'smartPredator';
          thePredator.tileGraphic = tileCodes.smartPredator;
          thePredator.speed = 3;
          game.brownSwitch = game.brownSwitch.toggle();
          break;
        case 'destroyPredator':
          if (game.debug) {
            console.log('destroy predator');
          }
          var thePredator = game.enemies.findByProperty('subType', 'smartPredator');
          thePredator.destroy();
          break;

      }

            // One-time use, then erase item from map.
      if (this.destroyOnUse) {
        this.destroy();
      }
    }
  };

  this.Draw = function () {
    if (!this.isAlive) {
      return false;
    }
    let sign = 1;

    if (this.type == 'player') {
      ctx.save();

      ctx.translate(this.position.x * 32 + 16 + stage.drawOffset.x, this.position.y * 32 + 16 + stage.drawOffset.y);
      ctx.rotate(this.rotation * Math.Radians);

      if (this.imageType == 'image') {
        ctx.drawImage(this.image, -16, -16);
      }


      ctx.restore();
    }


    else if (this.type == 'enemy' || this.type == 'item' || this.type == 'tool') {
      let tileNumber = this.tileGraphic;


            // Don't draw hidden switches.
      if (this.subType == 'hiddenSwitch' && !game.debug) {
        return;
      }

            // Teleporter animation.
      if (this.subType == 'teleporter') {
        tileNumber += Math.floor(game.gameTimer % 9 / 3);
      }

            // Draw smart predator path.
            // else if (this.subType == "smartPredator") {
                // for (var i = 0; i < this.pathScope.finishedPath.length-1; i++) {
                //    drawTileOffset(23,this.pathScope.finishedPath[i]);
                // }
            // }

            // Draw switch toggling.
      else if (game.brownSwitch && this.subType == 'switch') {
        if (this.color == 'brown') {
          tileNumber -= 1;
        } else if (this.color == 'brownOff') {
          tileNumber += 1;
        }
      }

            // Corrupt false tiles in opposite direction.
      if (this.subType == 'wall' || this.subType == 'water' || this.subType == 'exit' || this.subType == 'futureWall') {
        sign = -1;
      }

      const coords = this.position;

      if (this.subType == 'player2') {
        ctx.save();

        ctx.translate(this.position.x * 32 + 16 + stage.drawOffset.x, this.position.y * 32 + 16 + stage.drawOffset.y);
        ctx.rotate(this.rotation * Math.Radians);


        ctx.drawImage(player.image, -16, -16);

                // drawTileOffset(tileNumber, coords, sign, this.rotation);


        ctx.restore();
      }
      else {
        drawTileOffset(tileNumber, coords, sign);
      }
    }
  };

  this.destroy = function () {
    let pool = null;
    switch (this.type) {

      case 'enemy':
                // pool = game.enemies;
        this.isAlive = false;
        return;
        break;

      case 'item':
        pool = game.items;
        break;

      case 'tool':
        pool = game.tools;
        break;
    }
    pool.remove(pool.findByProperty('spriteID', this.spriteID));
  };
};

