define('AwesomeError', ['./Utility'], Utility => function AwesomeError(data) {
  this.data = data;
  this.message = `YOU WIN!\n\nActually, you didn't win. You've encountered a bug that's broken the game. I was trying to make you feel better about it.\n\n` +
    `Contact me and tell me, or else I'll never find out and this will never get fixed.\n\n` +
    `Also, "It's broken" with no further information is worse than saying nothing at all. That's why you get crappy tech support at your job.\n\n` +
    `Say what the specific problem is, and also say this stuff too:\n` +
    `Attempted function : ${this.data.attemptedFunction} \n` +
    `Level : ${typeof (this.data.level) !== 'undefined' ? this.data.level : 0}\n` +
    `Player Coords : ${this.data.position.x},${this.data.position.y}\n` +
    `Error Code : ${typeof (this.data.errorCode) !== 'undefined' ? this.data.errorCode : 'none'}\n\n`;
  // TODO: Change 'popup' to new Dom('.errorMessage');
  this.go = function go() {
    Utility.alert(this.message, 'popup');
  };
});
