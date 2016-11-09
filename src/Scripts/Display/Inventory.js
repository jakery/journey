define('Inventory',
  ['../Constants/Constants', '../Constants/TileCodes', '../Coordinates'],
  (Constants, TileCodes, Coordinates) => {
    function Inventory(game, player, globalDraw) {
      this.game = game;
      this.player = player;
      this.globalDraw = globalDraw;

      this.drawMoney = function drawMoney() {
        // Draw money count:
        let interval = Math.floor(273 / this.game.moneyCount);
        interval = Math.min(interval, 13);
        for (let i = 0; i < this.game.moneyCount; i += 1) {
          const xBase = new Coordinates(495 + (i * interval), 80);
          if (i < this.player.inventory.money) {
            // Collected money:
            this.globalDraw.drawTileAbsolute(TileCodes.coin, xBase);
          } else {
            // Uncollected money:
            this.globalDraw.drawTileAbsolute(TileCodes.coinUncollected, xBase);
          }
        }
      };
      this.totalKeys = () => this.player.inventory.yellowKeys +
        this.player.inventory.redKeys +
        this.player.inventory.cyanKeys +
        this.player.inventory.greenKeys;
      this.keyColors = new Set(['yellow', 'red', 'cyan', 'green']);
      this.drawKeys = function drawKeys() {
        // Draw keys.
        let keyDrawIndex = 0;
        const totalKeys = this.totalKeys();
        const keyInterval = (totalKeys < 9)
          ? Constants.baseUnit
          : Math.floor(273 / (totalKeys));
        for (const keyColor of this.keyColors) {
          const keyTileCode = TileCodes[`${keyColor}Key`];
          for (let i = 0; i < this.player.inventory[`${keyColor}Keys`]; i += 1) {
            this.globalDraw.drawTileAbsolute(keyTileCode,
              new Coordinates(500 + (keyDrawIndex * keyInterval), 110));
            keyDrawIndex += 1;
          }
        }
      };

      this.draw = function draw() {
        this.drawMoney();
        this.drawKeys();
      };
    }
    return Inventory;
  });
