// Todo: Decouple.
/*

Congratulations, you found the Password array.

Fun fact: I was going to make a web service to securely authenticate
these passwords on the server-side, but then thought to myself, "It's just a
video game."

Therefore, here's your reward for delving into the source code.

*/

define('ObscurelyNamedFile', ['./Constants/ErrorMessages'], (ErrorMessages) => {
  const ObscurelyNamedFile = function ObscurelyNamedFile(game) {
    this.game = game;
    this.passwordArray = [
      'title',
      'level1',
      'level2',
      'level3',
      'level4',
      'level5',
      'keyhole',
      'chip',
      'brown',
      'swimtime',
      'buttontime',
      'bounce',
      'balltrap',
      'fat',
      'diamond',
      'trimaze',
      'pushandgo',
      'cockney',
      'normal',
      'whiskey',
      'tango',
      'foxtrot',
      'trapdoors',
      'macho',
      'yellow',
      'throwaway',
      'brownies',
      'what',
      'thinkpush',
      'lamancha',
      'cutbacks',
      'buttonwalk',
      'capsule',
      'japan',
      'hardcore',
      'wave',
      'guard',
      'guide',
      'asthma',
      'queue',
      'maybeloop',
      'conan',
      'slant',
      'swearwords',
      'machine',
      'serious',
      'gameover',
      'enhance',
      'roidstrong',
      'cardio',
      'mine',
      'exiting',
      'island',
      'level1',
      'what',
      'waitjack',
    ];

    // Begins with "level" & is not "level1 - level5"
    this.isCrappyCheatAttempt = enteredPassword =>
      enteredPassword.match(/^level([6-9]|\d{2,})\s*$/g) !== null;

    this.process = function process() {
      let enteredPassword = this.game.enteredPassword;
      enteredPassword = enteredPassword.toLowerCase();


      // Derp. Stay in school, kids.
      if (enteredPassword === 'athsma') {
        enteredPassword = 'asthma';
      }
      const passwordLevel = this.passwordArray.indexOf(enteredPassword);
      if (passwordLevel === -1) {
        // Bad password.
        if (this.isCrappyCheatAttempt(enteredPassword)) {
          // CHEATER!
          this.game.level = -9999;
          this.game.loadMap(this.game.level);
        } else {
          this.game.passwordSidebarMessage = ErrorMessages.badPassword;
        }
      } else {
        // Good password.
        this.game.level = passwordLevel;
        this.game.loadMap(this.game.level);
        this.game.passwordSidebarMessage = '';
      }

      // Clear entered password.
      this.game.enteredPassword = '';
    };
  };
  return ObscurelyNamedFile;
});

