define('ErrorMessages', [], {
  touchscreen: {
    header: 'Notice: This game requires a physical keyboard to play. Touchscreen is not supported.',
    body: 'If you are using a hybrid, touchscreen-keyboard-combination device (such as Microsoft Surface), press Enter on your physical keyboard to bypass this message and continue to the game. (This feature is untested! You are a pioneer!)',
  },
  fileProtocol: {
    header: 'Running this game directly from the filesystem is unsupported.',
    body: 'You are running this game directly from your filesystem. (file:///). This won\'t work, because file:/// doesn\'t support AJAX, and this game needs AJAX to load the levels... for now. Instead, you can install NodeJS and run this game using \'npm start dev\'.',
  },
  browserSupport: {
    header: 'Your browser does not have the capabilities to run this game.',
    body: 'Please consider installing <a href="http://www.google.com/chrome">Google Chrome</a>. Hey, <strong>I</strong> use it, and look how I turned out.',
  },
  alertUtility: 'Alert message not properly configured.',

  // TODO: Decouple
  badPassword: 'That ain\'t no password.',
});
