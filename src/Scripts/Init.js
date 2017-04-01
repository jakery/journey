const Stage = require('./Stage');
const Player = require('./Sprite/Player');
const ObscurelyNamedFile = require('./ObscurelyNamedFile');
const Draw = require('./Draw/Draw');
const Sidebar = require('./Display/Sidebar');
const Credits = require('./Display/Credits');
const Game = require('./Game');
const Collision = require('./Collision');
const Update = require('./Update');

define('Init', ['./Constants/ErrorMessages', './Helpers/Dom', './Keyboard'], (ErrorMessages, Dom, Keyboard) => function Init(app) {
  this.app = app;
  this.mainDiv = new Dom(document.getElementById('main'));

  this.doPreWork = function doPreWork(bypassTouchscreen) {
    if (!this.handleTouchScreen(bypassTouchscreen)) { return false; }
    this.removeErrorPanels();
    if (!this.checkBrowserSupport()) { return false; }
    if (!this.checkProtocol()) { return false; }
    this.setStyle();

    this.app.stage = this.stage = new Stage();
    this.app.game = new Game(app);
    this.app.passwordHandler = new ObscurelyNamedFile(this.app.game);
    this.app.draw = new Draw(this.app.game, this.app.stage, null);
    this.app.game.assets.gridLineCoordinates = this.app.draw.generateGridLines();

    const keyboard = new Keyboard();
    keyboard.settings.exclusions = ['F5', 'F11', 'F12', 'Control'];
    keyboard.wireUp(document);

    this.app.player = this.player = new Player(this.app.game,
      this.app.stage,
      keyboard,
      this.app.draw,
      this.app.passwordHandler,
      this.app.game.assets.face
    );

    this.app.game.player = this.app.player;
    this.app.draw.player = this.app.player;

    this.app.game.hud = new Sidebar(this.app.game, this.app.stage, this.app.player, this.app.draw);
    this.app.game.credits = new Credits(this.app.game, this.app.stage, this.app.draw);

    this.app.update = new Update(app);
    this.app.collision = new Collision(app);
    return true;
  };

  this.formatErrorMessage = function formatErrorMessage(messageObject) {
    // TODO: Figure out how to reference this template as a variable;
    //       Move this template to a constants file.
    return `<div class="errorPanel"><h1>${messageObject.header}</h1><p>${messageObject.body}</p></div>`;
  };

  this.handleTouchScreen = function handleTouchScreen(bypassTouchscreen) {
    if (!bypassTouchscreen) {
      if (('ontouchstart' in window) || window.navigator.msMaxTouchPoints > 0) {
        this.mainDiv.before(this.formatErrorMessage(ErrorMessages.touchscreen));
        window.addEventListener('keydown', this.boundBypass);
        return false;
      }
    }
    return true;
  };

  this.removeErrorPanels = function removeErrorPanels() {
    // TODO: Add support to Dom object for array of dom elements.
    const errorPanels = document.getElementsByClassName('errorPanel');
    if (errorPanels.length) {
      for (let i = 0; i < errorPanels.length; i += 1) {
        const error = new Dom(errorPanels[i]);
        error.remove();
      }
    }
  };

  this.checkBrowserSupport = function checkBrowserSupport() {
    if (!Modernizr.fontface
      || Array.prototype.indexOf === undefined
      || !window.HTMLCanvasElement) {
      this.mainDiv.before(this.formatErrorMessage(ErrorMessages.browserSupport));
      this.mainDiv.hide();
      return false;
    }
    return true;
  };

  this.checkProtocol = function checkProtocol() {
    if (window.location.protocol === 'file:') {
      this.mainDiv.before(this.formatErrorMessage(ErrorMessages.fileProtocol));
      this.mainDiv.hide();
      return false;
    }
    return true;
  };

  this.setStyle = function setStyle() {
    // Turn off padding to make game fit in small monitors.
    this.mainDiv.style('padding', '0px');
  };

  this.bypass = function bypass(e) {
    const keyboard = new Keyboard();
    if (e.keyCode === keyboard.keys.Enter) {
      window.removeEventListener('keydown', this.boundBypass);
      this.app.run(true, this.app);
    }
  };
  this.boundBypass = this.bypass.bind(this);
});
