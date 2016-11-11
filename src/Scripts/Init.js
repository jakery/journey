const $ = require('jquery');

// TODO: Remove jQuery.
const $j = $.noConflict();

define('Init', ['./Constants/ErrorMessages', './Helpers/Dom', './Keyboard'], (ErrorMessages, Dom, Keyboard) => function Init() {
  this.mainDiv = new Dom(document.getElementById('main'));
  this.formatErrorMessage = function formatErrorMessage(messageObject) {
    // TODO: Figure out how to reference this template as a variable;
    //       Move this template to a constants file.
    return `<div class="errorPanel"><h1>${messageObject.header}</h1><p>${messageObject.body}</p></div>`;
  };

  this.handleTouchScreen = function handleTouchScreen(bypassTouchscreen) {
    if (!bypassTouchscreen) {
      // Don't run game on touchscreen devices.
      // TODO: Move these error messages to a new constants module.
      if (('ontouchstart' in window) || window.navigator.msMaxTouchPoints > 0) {
        this.mainDiv.before(this.formatErrorMessage(ErrorMessages.touchscreen));
        // TODO: Remove jQuery.
        // It turns out that removing this event listener opens
        //    a huge can of scope worms that I'm not ready to deal with yet.
        //    The solution is to finish modularizing everything in this file,
        //    and by that time, the scoping issues should have been fixed.
        $j(window).keydown(this.bypass);
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
    // Check for browser support.
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
    // Check for file:///
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
    if (e.keyCode === Keyboard.keys.Enter) {
      // TODO: Remove jQuery.
      // It turns out that removing this event listener opens
      //    a huge can of scope worms that I'm not ready to deal with yet.
      //    See note further up in file.
      $j(window).off('keydown', this.bypass);
      this.run(true);
    }
  };
});
