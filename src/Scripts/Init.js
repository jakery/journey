const $j = require('jquery');

// TODO: Remove jQuery.

define('Init', ['./Constants/ErrorMessages', './Helpers/Dom', './Keyboard'], (ErrorMessages, Dom, Keyboard) => function Init() {
  this.app = null;
  this.mainDiv = new Dom(document.getElementById('main'));
  this.formatErrorMessage = function formatErrorMessage(messageObject) {
    // TODO: Figure out how to reference this template as a variable;
    //       Move this template to a constants file.
    return `<div class="errorPanel"><h1>${messageObject.header}</h1><p>${messageObject.body}</p></div>`;
  };



  this.handleTouchScreen = function handleTouchScreen(bypassTouchscreen, app = null) {
    if (app !== null) { this.app = app; }
    if (!bypassTouchscreen) {
      // Don't run game on touchscreen devices.
      // TODO: Move these error messages to a new constants module.
      if (true || ('ontouchstart' in window) || window.navigator.msMaxTouchPoints > 0) {
        this.mainDiv.before(this.formatErrorMessage(ErrorMessages.touchscreen));
        // TODO: Remove jQuery.
        // It turns out that removing this event listener opens
        //    a huge can of scope worms that I'm not ready to deal with yet.
        //    The solution is to finish modularizing everything in this file,
        //    and by that time, the scoping issues should have been fixed.
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
      // TODO: Remove jQuery.
      // It turns out that removing this event listener opens
      //    a huge can of scope worms that I'm not ready to deal with yet.
      //    See note further up in file.
      window.removeEventListener('keydown', this.boundBypass);
      this.app.run(true, this.app);
    }
  };
  this.boundBypass = this.bypass.bind(this);
});
