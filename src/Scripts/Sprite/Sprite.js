// TODO: Check for items to decouple
// TODO: Refactor this out into a group of modules.
// TODO: Create unit tests.
const Utility = require('../Utility/Utility');
const Constants = require('../Constants/Constants');
const TileCodes = require('../Constants/TileCodes');
const DeathMessages = require('../Constants/DeathMessages');
const Coordinates = require('../Coordinates');
const Inventory = require('./Inventory');
const Draw = require('../Draw/Draw');
const Movement = require('./Movement');
const Input = require('../Input/Input');

define('Sprite', [], () => {
  // TODO: Remove 'player' parameter.
  const Sprite = function Sprite(spriteArguments) {
    if (!spriteArguments.game) {
      throw new Error('Sprite must have an associated game object.');
    }
    this.spriteData = spriteArguments.spriteData;
    this.nameID = this.spriteData.name;
    this.clipping = true;
    this.movementAnimationSettings = { easing: 'linear', duration: 200 };
    this.game = spriteArguments.game;
    this.stage = spriteArguments.stage;
    this.keyboard = spriteArguments.keyboard;
    this.globalDraw = new Draw(this.game, this.stage, null, null);
    this.passwordHandler = spriteArguments.pwh || null;
    this.player = spriteArguments.player;


    this.baseUnit = 32;
    this.halfBaseUnit = this.baseUnit / 2;
    this.maxPasswordLength = 11;
    this.keyboardRepeatTickDelay = 10;


    this.isAlive = true;

    this.spriteID = null;
    this.nameID = Constants.emptyString;
    this.travelableLayer = 'travelableTiles';
    this.inventory = new Inventory();
    this.customVariables = {};
    this.verticalOffset = this.baseUnit * 1;
    this.horizontalOffset = this.baseUnit * 0;
    this.width = this.baseUnit * 1;
    this.height = this.baseUnit * 2;
    this.image = null;
    this.tileGraphic = null;
    this.speed = null;
    this.defaultSpeedModulus = 8;

    this.callback = null;
    this.destroyOnUse = false;

    this.isDead = false;
    this.hasKilledPlayer = false;

    this.visible = true;

    this.isPreferringClockwise = false;

    this.type = Constants.emptyString;
    this.subType = Constants.emptyString;

    // TODO: Migrate these string literals to the constants file.
    this.isKey = () => (this.subType === 'yellowKey' || this.subType === 'redKey' || this.subType === 'cyanKey' || this.subType === 'greenKey');
    this.hitRegistered = false;

    this.imageType = Constants.emptyString;

    this.displayName = Constants.emptyString;

    this.message = Constants.emptyString;

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

    // TODO: Refactor this as "teleporterDestination"
    //       And also move this to Teleporter.js
    this.destination = null;

    this.animationFrame = 0;
    this.animationDirection = 1;
    this.direction = Constants.directions.down;
    this.rotation = 0;

    this.position = new Coordinates(0, 0);

    this.imageType = 'image';
    this.image = this.player;
    this.type = 'switch';
    this.player = this.game.player;
    this.tileGraphic = this.spriteData.gid;

    this.resetLevelVariables = function resetLevelVariables() {
      this.inventory = new Inventory();
      this.isDead = false;
    };

    this.tileDistanceToSprite = function tileDistanceToSprite(sprite) {
      return this.tileDistanceBetween(this.position, sprite.position);
    };
    this.surroundingTiles = null;
    this.getSurroundingTiles = function getSurroundingTiles(coords) {
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
      if (this.game.map.isInBounds(surroundingTiles.up.coords)) {
        surroundingTiles.up.type = this.game.map.getTileTypeByCoords(
          surroundingTiles.up.coords.x,
          surroundingTiles.up.coords.y);
      }
      if (this.game.map.isInBounds(surroundingTiles.down.coords)) {
        surroundingTiles.down.type = this.game.map.getTileTypeByCoords(
          surroundingTiles.down.coords.x,
          surroundingTiles.down.coords.y);
      }
      if (this.game.map.isInBounds(surroundingTiles.left.coords)) {
        surroundingTiles.left.type = this.game.map.getTileTypeByCoords(
          surroundingTiles.left.coords.x,
          surroundingTiles.left.coords.y);
      }
      if (this.game.map.isInBounds(surroundingTiles.right.coords)) {
        surroundingTiles.right.type = this.game.map.getTileTypeByCoords(
          surroundingTiles.right.coords.x,
          surroundingTiles.right.coords.y);
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

    this.getTarget = () => Movement.getTarget(this.direction, this.position,
      new Coordinates(this.game.map.width, this.game.map.height)
    );

    this.canMove = function canMove(coordinates) {
      const destination = (coordinates == null) ? this.getTarget() : coordinates;

      // Get all tile layers.
      const destinationTileType = this.game.map.getTileTypeByCoords(destination.x, destination.y);

      if (!Movement.checkBlockers(destinationTileType, this.game, this)) {
        return false;
      }

      // TODO: Swap out these magic strings.
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
          if (this.game.tools[i].subType === 'pushBlock' || Utility.areColliding(destination, this.game.tools[i].position)) {
            return false;
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

    this.getRotation = () => Movement.getRotation(this.direction);
    this.turn = direction => Movement.turn(this, direction);
    this.turnAround = () => Movement.turnAround(this);
    this.turnAntiClockwise = () => Movement.turnAntiClockwise(this);
    this.turnProClockwise = () => Movement.turnProClockwise(this);
    this.goForward = direction => Movement.goForward(this, direction);

    this.checkTile = function checkTile() {
      // var tileIndex = game.map.getTileIndexByCoords
      const tileType = this.game.map.getTileTypeByCoords(this.position.x, this.position.y);

      // Normal.
      if (tileType === TileCodes.floor) {
        return true;
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
        this.isDead = true;

        if (this.type === 'player') {
          const message = Utility.array.getRandomElement(DeathMessages.water);
          this.game.setDeadMessage(message);
        } else if (this.type === 'enemy') {
          this.destroy();
        } else if (this.subType === 'pushBlock') {
          // Block hits water and disappears.
          Utility.array.removeBySpriteId(this.game.tools, this.spriteId);
        }
        // }
      }
      return false;
    };

    this.input = new Input();
    // Todo: move all of this to a separate file. This is outside the scope of sprites.
    this.getInput = function getInput() {
      this.input.readKeyboard.call(this);
    };

    this.executeInput = function executeInput(keyName, repeatDelay, callback, args) {
      const keyHeldDuration = this.keyboard.keyHeldDuration;
      if (this.keyboard.keyIsDown[keyName]) {
        if (!keyHeldDuration[keyName] || keyHeldDuration[keyName] > repeatDelay) {
          // TODO: Remove magic number.
          if (!(keyHeldDuration[keyName] % 2)) {
            callback.apply(this, args);
          }
        }
        keyHeldDuration[keyName] += 1;
        return true;
      }
      return false;
    };

    this.update = function update() {
      // TODO: Refactor out all sprite callbacks into separate file.
      //       Instantiate update functions upon load.
      if (!this.isAlive) {
        return false;
      }

      if (this.type === 'tool') {
        if (this.subType === 'pushBlock') {
          if (this.gettingPushed) {
            this.direction = this.game.player.direction;
            this.goForward();

            this.gettingPushed = false;
          }
        }
      }
      if (this.type === 'enemy') {
        this.updateMovementPattern();
      }
      return true;
    };

    this.updateMovementPattern = function updateMovementPattern() {
      // Enemy movement patterns.
      switch (this.subType) {
        // TODO: Can't delete "nascar" movementPattern yet because it's being used as a hack
        // for other movement patterns. Needs refactoring.
        case 'nascar':
          if (this.game.gameTimer % this.speedModulus) {
            return false;
          }

          if (!this.canMove()) {
            this.turnAntiClockwise();
          }

          this.goForward();
          break;

        case 'berzerker':
          // I think this was for an unused enemy type.
          // If I'm reading this right, the idea was to
          // be a NASCAR enemy, but also to
          // chase after the player if the player happens
          // to be on the same row or column.
          if (this.game.gameTimer % this.speedModulus) {
            return false;
          }

          if (this.position.x === this.game.player.position.x) {
            if (this.position.y > this.game.player.position.y) {
              this.turn(Constants.directions.up);
            } else {
              this.turn(Constants.directions.down);
            }
          } else if (this.position.y === this.game.player.position.y) {
            if (this.position.x > this.game.player.position.x) {
              this.turn(Constants.directions.left);
            } else {
              this.turn(Constants.directions.right);
            }
          }

          if (!this.canMove()) {
            this.turnAntiClockwise();
          }

          this.goForward();
          break;
        default:
          break;
      } // switch(this.subType)
      return true;
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

      // TODO: refactor to hitSwitch();
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
      return true;
    };

    this.draw = function drawSprite() {
      const ctx = this.globalDraw.ctx;

      if (!this.isAlive) {
        return false;
      }

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
          const speedModulus = 9;
          const totalAnimationFrames = 3;
          tileNumber += Math.floor((this.game.gameTimer % speedModulus) / totalAnimationFrames);
        } else if (this.game.brownSwitch && this.subType === 'switch') {
          // Draw switch toggling.
          if (this.color === 'brown') {
            tileNumber -= 1;
          } else if (this.color === 'brownOff') {
            tileNumber += 1;
          }
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

          ctx.drawImage(this.game.assets.face, -this.halfBaseUnit, -this.halfBaseUnit);

          ctx.restore();
        } else {
          let sign = 1;
          // Corrupt false tiles in opposite direction.
          if (this.subType === 'wall' || this.subType === 'water' || this.subType === 'exit' || this.subType === 'futureWall') {
            sign = -1;
          }
          this.globalDraw.drawTileOffset(tileNumber, coords, sign);
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
      Utility.array.removeBySpriteId(pool, this.spriteID);
    };
  };

  return Sprite;
});
