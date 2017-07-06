const Ball = require('./Ball.js');
const Nascar = require('./Nascar.js');
const BritishNascar = require('./BritishNascar.js');
const Gronpree = require('./Gronpree.js');
const Predator = require('./Predator.js');
const SmartPredator = require('./SmartPredator.js');
const Player2 = require('./Player2.js');

define('EnemyFactory', [], () => function EnemyFactory(spriteArguments) {
  this.spriteArguments = spriteArguments;

  this.ball = Ball;
  this.nascar = Nascar;
  this.britishNascar = BritishNascar;
  this.gronpree = Gronpree;
  this.predator = Predator;
  this.smartPredator = SmartPredator;
  this.player2 = Player2;

  this.createFrom = function createFrom(spriteData) {
    const theseArguments = Object.create(spriteArguments);
    theseArguments.spriteData = spriteData;
    const enemyType = theseArguments.spriteData.subType;
    return new this[enemyType](theseArguments);
  };
});
