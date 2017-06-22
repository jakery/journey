// Todo: Identify things to decouple.
const AwesomeError = require('./AwesomeError');
const TileCodes = require('./Constants/TileCodes');
const Map = require('./Map/Map');

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
  ) => function Game(app) {
    this.app = app || null;
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
    // TODO: Refactor this into 'game.switch.<color>'
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

    this.restartLevel = function restartLevel() {
      this.loadMap(this.level);
    };

    this.initializeMapFeatures = function initializeMapFeatures() {
      this.items = this.map.loadItems();
      this.enemies = this.map.loadEnemies();
      this.tools = this.map.loadTools();
      this.moneyCount = Utility.array.findAllByProperty(this.items, 'subType', 'money', true).length;
      this.map.setProperties();
    };

    // TODO: Rename to "tryLoadMap"
    this.loadMap = function loadMap(levelNumberArg) {
      let levelNumber = levelNumberArg;
      this.resetLevelVariables();
      app.player.resetLevelVariables();

      if (this.level < 0) {
        levelNumber = 'cheater';
      }

      if ({}.hasOwnProperty.call(this.levels, levelNumber)
        && this.levels[levelNumber]) {
        this.processMap(this.levels[levelNumber]);
      } else {
        const awesomeError = new AwesomeError({
          attemptedFunction: 'loadMap ()',
          errorCode: 'Level doesn\'t exist',
          position: app.player.position,
          level: this.level,
        });
        awesomeError.go();
        throw new Error('Level doesn\'t exist.');
      }
    };

    this.processMap = function processMap(data) {
      const mapTileArray = (typeof (data) === 'string')
        ? JSON.parse(data)
        : data;
      this.map = new Map(mapTileArray, this, this.app.stage);
      // Put player on start tile.
      this.app.player.position = this.map.getCoordsByTileIndex(
        this.map.layers[0].data.indexOf(TileCodes.start)
      );
      this.initializeMapFeatures();
    };


    // TODO: Swap 'self' with 'this'; move to Game.js.
    this.nextLevel = function nextLevel() {
      this.level = this.nextLevelNumber;
      this.atExit = false;
      this.app.player.inventory = new Inventory();
      this.loadMap(this.level);
    };
  });
