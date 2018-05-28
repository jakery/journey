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
const Blockers = require('./Blockers');
const Input = require('../Input/Input');

define('Sprite', [], () => {
  const Sprite = function Sprite(spriteArguments) {
    const everyOtherFrame = 2;

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
    // eslint-disable-next-line no-magic-numbers
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
    this.widthProportion = 1;
    this.heightProportion = 2;
    this.width = this.baseUnit * this.widthProportion;
    this.height = this.baseUnit * this.heightProportion;
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

    this.blockers = new Blockers(this.game, this);

    this.reset = function reset() {
      this.inventory = new Inventory();
      this.isDead = false;
    };
    this.resetLevelVariables = this.reset;

    this.tileDistanceToSprite = function tileDistanceToSprite(sprite) {
      return this.tileDistanceBetween(this.position, sprite.position);
    };
    this.surroundingTiles = null;

    // TODO: Move this function to Map.js
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

      Object.keys(surroundingTiles).forEach((direction) => {
        if (this.game.map.isInBounds(surroundingTiles[direction].coords)) {
          const neighborTile = surroundingTiles[direction];
          neighborTile.type = this.game.map.getTileTypeByCoords(neighborTile.coords);
        }
      });
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
      const destinationTileType = this.game.map.getTileTypeByCoords(destination);

      if (!this.blockers.check(destinationTileType)) {
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

    // TODO: Refactor and swap these calls out with a single "Object.Apply" to the Movement.js file.
    this.getRotation = () => Movement.getRotation(this.direction);
    this.turn = direction => Movement.turn(this, direction);
    this.turnAround = () => Movement.turnAround(this);
    this.turnAntiClockwise = () => Movement.turnAntiClockwise(this);
    this.turnProClockwise = () => Movement.turnProClockwise(this);
    this.goForward = direction => Movement.goForward(this, direction);

    this.checkTile = function checkTile() {
      // var tileIndex = game.map.getTileIndexByCoords
      const tileType = this.game.map.getTileTypeByCoords(this.position.x, this.position.y);

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

      // All other tiles block movement by default.
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
          if (!(keyHeldDuration[keyName] % everyOtherFrame)) {
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
          if (this.game.gameTimer % this.speedModulus !== 0) {
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


    this.registerHit = function registerHit(s) {
      const sprite = s;
      if (!this.isAlive) {
        return false;
      }

      // TODO: Create help type and move thiws to there.
      if (this.subType === 'help' || this.subType === 'help2') {
        if (sprite.type === 'player') {
          this.game.showMessage = true;
          this.game.messageText = this.message;
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
      let tileNumber = this.tileGraphic;

      // Don't draw hidden switches.
      if (this.subType === 'hiddenSwitch' && !this.game.debug) {
        return false;
      } else if (this.subType === 'teleporter') {
        // Teleporter animation.
        const speedModulus = 9;
        const totalAnimationFrames = 3;
        tileNumber += Math.floor((this.game.gameTimer % speedModulus) / totalAnimationFrames);
      } else if (this.subType === 'player2') {
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
        let sign = Constants.sign.positive;
        // Corrupt false tiles in opposite direction.
        if (this.subType === 'wall' || this.subType === 'water' || this.subType === 'exit' || this.subType === 'futureWall') {
          sign = Constants.sign.negative;
        }
        this.globalDraw.drawTileOffset(tileNumber, this.position, sign);
      }
      return false;
    };

    this.destroy = function destroy() {
      let pool = null;
      switch (this.type) {
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
