const Sprite = require('../Sprite');
const RenderSettings = require('../../Constants/RenderSettings');
const Constants = require('../../Constants/Constants');
const Coordinates = require('../../Coordinates');

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
  EnemyAbstract.prototype = Object.create(Sprite.prototype);
  EnemyAbstract.prototype.constructor = EnemyAbstract;
  return EnemyAbstract;
});
