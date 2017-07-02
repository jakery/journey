const Ball = require('./Ball.js');
const Nascar = require('./Nascar.js');
const BritishNascar = require('./BritishNascar.js');
const Gronpree = require('./Gronpree.js');
const Predator = require('./Predator.js');
const SmartPredator = require('./SmartPredator.js');
const Player2 = require('./Player2.js');

define('AllEnemies', [], {
  ball: Ball,
  nascar: Nascar,
  britishNascar: BritishNascar,
  gronpree: Gronpree,
  predator: Predator,
  smartPredator: SmartPredator,
  player2: Player2,
});
