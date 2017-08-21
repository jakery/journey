const Sprite = require('../Sprite');
const RenderSettings = require('../../Constants/RenderSettings');
const Constants = require('../../Constants/Constants');
const Coordinates = require('../../Coordinates');
const Utility = require('../../Utility/Utility');
const DeathMessages = require('../../Constants/DeathMessages');

define('EnemyAbstract', [], () => {
  function EnemyAbstract(spriteArguments) {
    Sprite.call(this, spriteArguments);
    this.registerHit = function registerHit() { };
    const eData = spriteArguments.spriteData;
    this.tileGraphic = eData.gid;
    this.spriteID = `enemy ${eData.id}`;
    this.nameID = eData.name;
    this.type = 'enemy';
    this.subType = eData.subType;
    this.imageType = 'tile';
    this.position = new Coordinates(
      eData.x / RenderSettings.baseUnit,
      (eData.y - RenderSettings.baseUnit) / RenderSettings.baseUnit
    );
    this.speed = this.game.defaultEnemySpeed;
    this.defaultSpeedModulus = 8;
    this.speedModulus = 8;
    this.deathMessages = [];

    // Change initial enemy facing direction.
    if (typeof (eData.properties.direction) !== 'undefined') {
      this.direction = Constants.directions[eData.properties.direction];
      if (this.subType === 'player2') {
        this.rotation = this.getRotation();
      }
    }

    if (typeof (eData.properties.autoMove) !== 'undefined') {
      this.autoMove = eData.properties.autoMove === 'true';
    }

    if (this.subType === 'smartPredator') {
      this.speed = 3;
    }

    this.checkCollision = function checkCollision() {
      // TODO: Refactor with "areSpritesColliding".
      if (Utility.areSpritesColliding(this.player, this)) {
        this.player.isDead = true;
        this.hasKilledPlayer = true;

        let message = '';
        if (this.deathMessages.length > 0) {
          message = Utility.array.getRandomElement(this.deathMessages);
        } else {
          // TODO: Refactor as constants message.
          message = `BUG!\n\nThe game has registered you as dead. If you're seeing this message, it's a bug in the level. Contact Jake and tell him that he accidentally put a(n) ${this.subType} in the Enemy array (which is why you died when you touched it). )`;
        }

        this.game.setDeadMessage(message);
      }
    };

    this.destroy = function destroy() {
      this.isAlive = false;
    };
  }
  EnemyAbstract.prototype = Object.create(Sprite.prototype);
  EnemyAbstract.prototype.constructor = EnemyAbstract;
  return EnemyAbstract;
});
