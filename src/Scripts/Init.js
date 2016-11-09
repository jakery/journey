const $ = require('jquery');

// TODO: Remove jQuery.
const $j = $.noConflict();

define('Init', ['./Helpers/Dom', './Keyboard'], (Dom, Keyboard) => function Init() {
  this.mainDiv = new Dom(document.getElementById('main'));

  this.handleTouchScreen = function handleTouchScreen(bypassTouchscreen) {
    if (!bypassTouchscreen) {
      // Don't run game on touchscreen devices.
      // TODO: Move these error messages to a new constants module.
      if (('ontouchstart' in window) || window.navigator.msMaxTouchPoints > 0) {
        this.mainDiv.before('<div class="errorPanel"><h1>Notice: This game requires a physical keyboard to play. Touchscreen is not supported.</h1><p>If you are using a hybrid, touchscreen-keyboard-combination device (such as Microsoft Surface), press Enter on your physical keyboard to bypass this message and continue to the game. (This feature is untested! You are a pioneer!)</p></div>');
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

  this.checkBrowserSupport = function checkBrowserSupport() {
    // Check for browser support.
    if (!Modernizr.fontface
      || Array.prototype.indexOf === undefined
      || !window.HTMLCanvasElement) {
      this.mainDiv.before('<div class="errorPanel"><h1>Your browser does not have the capabilities to run this game.</h1><p>Please consider installing <a href="http://www.google.com/chrome">Google Chrome</a>. Hey, <strong>I</strong> use it, and look how I turned out.</p></div>');
      this.mainDiv.hide();
      return false;
    }
    return true;
  };

  this.checkProtocol = function checkProtocol() {
    // Check for file:///
    if (window.location.protocol === 'file:') {
      this.mainDiv.before('<div class="errorPanel"><h1>Running this game directly from the filesystem is unsupported.</h1><p>You are running this game directly from your filesystem. (file:///). This won\'t work, because file:/// doesn\'t support AJAX, and this game needs AJAX to load the levels... for now. Instead, you can install NodeJS and run this game using \'npm start dev\'.</div>');
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
