const Sprite = require('./Sprite');
const RenderSettings = require('../Constants/RenderSettings');
const Constants = require('../Constants/Constants');
const Coordinates = require('../Coordinates');

define('Enemy', [], () => {
  function Enemy(eData, ...args) {
    Sprite.Sprite.call(this, ...args);
    this.registerHit = function registerHit() { };
    this.tileGraphic = eData.gid;
    this.spriteID = `enemy ${eData.id}`;
    this.nameID = eData.name;
    this.type = 'enemy';
    this.subType = eData.enemyType;
    this.imageType = 'tile';
    this.position = new Coordinates(
      eData.x / RenderSettings.baseUnit,
      (eData.y - RenderSettings.baseUnit) / RenderSettings.baseUnit
    );
    this.speed = this.game.defaultEnemySpeed;
    this.defaultSpeedModulus = 8;
    this.speedModulus = 8;

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
  }
  this.prototype = Object.create(Sprite.Sprite.prototype);
  this.prototype.constructor = Enemy;
  return Enemy;
});
