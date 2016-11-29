define(
  'Game',
  [
    './Constants/Constants',
    './Constants/DeathMessages',
    './Sprite/Inventory',
    './Utility/Utility',
    './Map/Levels',
  ],
  (
    Constants,
    DeathMessages,
    Inventory,
    Utility,
    Levels
  ) => function Game() {
    // TODO: Refactor these properties into a hierarchy.
    this.debug = false;
    this.betaTest = true;
    this.ticks = this.gameTimer = -1;
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
    this.mode = Constants.gameModes.normal;
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
    this.assets = {
      face: document.getElementById('face'),
      devgraphics: document.getElementById('devgraphics'),
      dungeon: document.getElementById('dungeon'),
    };
    this.levels = Levels.load();

    this.resetLevelVariables = function resetLevelVariables() {
      this.winMessage = null;
      this.isPaused = false;
      this.atExit = false;
      this.gameTimer = 0;
      this.clock = -1;
      this.brownSwitch = false;
    };

    this.returnToTitle = function returnToTitle() {
      this.level = -1;
      this.nextLevelNumber = 0;
      this.winMessage = null;
      this.theEnd = false;
      this.mode = Constants.gameModes.title;
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

    this.setProperties = function setProperties(obj) {
      Object.assign(this, obj);
    };

    // this.nextLevel = function nextLevel() {
    // TODO: Remove this identical function from App.js and retest.
    // this.level = this.nextLevelNumber;
    // this.atExit = false;
    // this.player.inventory = new Inventory();
    // this.loadMap(this.level);
    // };

    this.restartLevel = function restartLevel() {
      this.loadMap(this.level);
    };

    // this.loadMap = function loadMap() {
    //   // TODO: Migrate loadMap();
    // };
  });
