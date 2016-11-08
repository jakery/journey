define('Game', ['./Utility'], (Utility) => function Game() {
  // TODO: Refactor these properties into a hierarchy.
  this.debug = false;
  this.betaTest = true;
  this.gameTimer = -1;
  this.clock = -1;
  this.level = -1;
  this.nextLevelNumber = 0;
  this.displayClockModifier = 50;
  this.atExit = false;
  this.winMessage = null;
  this.theEnd = false;
  this.corruptionSpeedupThreshold = 52;
  this.maxCorruption = 58;
  this.timerModulus = 50;
  this.hud = null;
  this.credits = null;
  this.iDataArray = null;
  this.items = null;
  this.eDataArray = null;
  this.enemies = null;
  this.tools = null;
  this.showMessage = false;
  this.messageText = '';
  this.mode = 'normal'; // TODO: Remove this magic string.
  this.enteredPassword = '';
  this.password = '';
  // Todo: refactor 'isPaused' into 'game.mode = 'paused'
  this.isPaused = false;
  this.moneyCount = 0;
  this.redSwitch = false;
  this.yellowSwitch = false;
  this.greenSwitch = false;
  this.brownSwitch = false;
  this.onQuickCorruptTile = false;
  this.quickCorruptTriggered = false;
  this.corruption = 0;
  this.corruptionTimer = 0;
  this.deathCount = 0;
  this.lotsOfDeathsModulus = 10;
  this.passwordSidebarMessage = '';
  this.defaultEnemySpeed = 8;
  this.fadeOut = 0;
  this.assets = {};

  this.setLevelClock = function setLevelClock() {
    this.clock = Math.floor(this.gameTimer / this.displayClockModifier);
  };


  this.returnToTitle = function returnToTitle() {
    this.level = -1;
    this.nextLevelNumber = 0;
    this.winMessage = null;
    this.theEnd = false;
    this.mode = 'title';
    this.nextLevel();
  };

  this.setDeadMessage = function setDeadMessage(m) {
    let message = m;
    this.deathCount += 1;
    this.showMessage = true;
    if (!(this.deathCount % this.lotsOfDeathsModulus)) {
      message = Utility.array.getRandomElement(DeathMessages.miscDeath);
    }
    this.messageText = `${message}\n\nPress enter to restart.`;
  };
});
