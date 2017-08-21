// TODO: Decouple by moving all of these to their respective tile class files.
define('Blockers', ['../Constants/TileCodes'], (TileCodes) => {
  const Blocker = function Blocker(params) {
    this.test = () => false;
    this.callback = () => false;
    if (params) {
      if (typeof params === 'function') {
        this.test = params;
      } else {
        Object.assign(this, params);
      }
    }
  };

  const Blockers = function Blockers(game, sprite) {
    this.game = game;
    this.sprite = sprite;

    this.check = function check(key) {
      const blocker = this[key] || null;
      if (blocker === null || blocker.test.apply(this.sprite)) {
        return true;
      }
      return blocker.callback.apply(this.sprite);
    };


    this.wall = new Blocker();

    this.futureFloor = new Blocker();

    this.dRedBlockInactive = new Blocker(function test() { return this.game.redSwitch; });

    this.aRedBlockInactive = new Blocker(function test() { return !this.game.redSwitch; });

    this.dYellowBlockInactive = new Blocker(function test() { return this.game.yellowSwitch; });

    this.aYellowBlockInactive = new Blocker(function test() { return !this.game.yellowSwitch; });

    this.dGreenBlockInactive = new Blocker(function test() { return this.game.greenSwitch; });

    this.aGreenBlockInactive = new Blocker(function test() { return !this.game.greenSwitch; });

    this.brownBlockInactive = new Blocker(function test() { return !this.game.brownSwitch; });

    this.brownBlockActive = new Blocker(function test() { return this.game.brownSwitch; });

    this.yellowDoor = new Blocker({
      test: function test() { return this.inventory.yellowKeys > 0; },
      callback: function callback() {
        // Unlock door.
        this.game.map.unlockDoor(this.position);
        // Player has used key.
        this.inventory.yellowKeys -= 1;
        return true;
      },
    });

    this.redDoor = new Blocker(function test() { return this.inventory.redKeys > 0; });
    this.greenDoor = new Blocker(function test() { return this.inventory.greenKeys > 0; });
    this.cyanDoor = new Blocker(function test() { return this.inventory.cyanKeys > 0; });

    this.toll = new Blocker(function test() {
      return this.inventory.money >= this.game.moneyCount;
    });

    // Map the numbers as aliases for all tile names in this list.
    Object.keys(TileCodes).forEach((tileName) => {
      if (typeof this[tileName] !== 'undefined') {
        this[TileCodes[tileName]] = this[tileName];
      }
    });
  };

  return Blockers;
});
