/*

Congratulations, you found the Password array.

Fun fact: I was going to make a web service to securely authenticate
these passwords on the server-side, but then thought to myself, "It's just a
video game."

Therefore, here's your reward for delving into the source code.

*/


const password = [
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

function processPassword() {
  enteredPassword = enteredPassword.toLowerCase();


  // Begins with "level" & is not "level1 - level5"
  // TODO: There's probably a good way to refactor this into a single Regex statement, but I've got bigger fish to fry.
  if (enteredPassword !== 'level' && enteredPassword.indexOf('level') === 0 && enteredPassword.match(/^level[1-5]\s*$/g) === null) {
    // CHEATER!

    game.level = -10000;
    loadMap(game.level);
  } else {
    // Derp. Stay in school, kids.
    if (enteredPassword === 'athsma') {
      enteredPassword = 'asthma';
    }

    const passwordLevel = password.indexOf(enteredPassword);

    if (passwordLevel === -1) {
      // Bad password.
      game.passwordHudMessage = "That ain't no password.";
    } else {
      // Good password.
      game.level = passwordLevel;
      loadMap(game.level);
      game.passwordHudMessage = '';
    }
  }

  // Clear entered password.
  enteredPassword = '';
}

