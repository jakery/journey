define('Constants', [], {
  emptyString: '',
  keys: {
    yellow: 'yellowKey',
    red: 'redKey',
    green: 'greenKey',
    cyan: 'cyanKey',
  },
  // TODO: Refactor to "Enumerables".
  gameModes: {
    title: 0,
    password: 1,
    normal: 2,
    credits: 3,
  },
  // TODO: Remove all references to Constants.Directions and then delete this.
  // TODO: But first, anything that relies on Constants.directions has to be unit tested.
  directions: {
    up: 0,
    right: 1,
    down: 2,
    left: 3,
  },
});
