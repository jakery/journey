const $ = require('jquery');

define('JakesJourney', ['./DeathMessages', './TileCodes', './Coordinates', './Sprite', './Keyboard', './Utility', './Draw'],
(DeathMessages, TileCodes, Coordinates, Sprite, Keyboard, Utility, Draw) => {
  const $j = $.noConflict();
  const enteredPassword = '';
  const passwords = {};

  const interacting = false;

  let master;
  let player;
  let gameInterval = null;
  let game;
  let stage;
  let bypass;
  let draw;

  const yOffset = 0;
  const stageObject = function () {
    this.isOffset = true;

    this.gameCanvas = document.getElementById('gameCanvas');
    this.width = null;
    this.height = null;
    this.playBlockWidth = 15;
    this.playboxWidth = null;
    this.playBlockHeight = 12;
    this.playboxHeight = null;
    this.hudCoords = {};
    this.hudWidth = null;
    this.hudHeight = null;

    this.playboxTileWidth = null;
    this.playboxTileHeight = null;

    this.drawOffset = null;
    this.halfBoxWidthLess16 = null;
    this.halfBoxHeightLess16 = null;
    this.playboxTileCount = null;
    this.init = function () {
      this.width = $j(this.gameCanvas).width();
      this.height = $j(this.gameCanvas).height();

      this.playboxWidth = this.playBlockWidth * 32;
      this.playboxHeight = this.playBlockHeight * 32;

      this.halfBoxWidthLess16 = (this.playboxWidth / 2) - 16;
      this.halfBoxHeightLess16 = (this.playboxHeight / 2);

      this.playboxTileWidth = this.playboxWidth / 32;
      this.playboxTileHeight = this.playboxHeight / 32;

      this.playboxTileCount = this.playboxTileWidth * this.playboxTileHeight;

      this.hudCoords = new Coordinates(this.playboxWidth, 0);
      this.hudWidth = this.width - this.playboxWidth;
      this.hudHeight = this.height;
    };

    this.getCoordsByTileIndex = function (i) {
      return new Coordinates(
        i % this.playboxTileWidth,
        Math.floor(i / this.playboxTileWidth)
      );
    };
  };

  const assets = {};

  function awesomeError(data) {
    Utility.alert(
      `YOU WIN!\n\nActually, you didn't win. You've encountered a bug that's broken the game. I was trying to make you feel better about it.\n\n` +
      `Contact me and tell me, or else I'll never find out and this will never get fixed.\n\n` +
      `Also, "It's broken" with no further information is worse than saying nothing at all. That's why you get crappy tech support at your job.\n\n` +
      `Say what the specific problem is, and also say this stuff too:\n` +
      `Attempted function :  ${data.attemptedFunction} \n` +
      `Level : ${typeof (game.level) !== 'undefined' ? game.level : 0}\n` +
      `Player Coords : ${player.position.x},${player.position.y}\n` +
      `Error Code : ${typeof (data.errorCode) !== 'undefined' ? data.errorCode : 'none'}\n\n`
    );
  }

  function getMultiDimensionalMap(originalArray, width) {
    const mdMap = [];
    for (let i = 0; i < originalArray.length; i += width) {
      const smallarray = originalArray.slice(i, i + width);
      mdMap.push(smallarray);
    }
    return mdMap;
  }

  function loadMap(levelNumber) {
    game.winMessage = null;
    game.isPaused = false;
    game.atExit = false;
    player.inventory = new Sprite.Inventory();
    player.isDead = false;
    game.gameTimer = 0;
    game.clock = 0;
    game.brownSwitch = false;

    if (game.level < 0) {
      levelNumber = 'cheater';
    }

    $j.ajax({
      url: `Assets/Levels/${levelNumber}.json`,
      async: false,
      error(response) {
        awesomeError({ attemptedFunction: 'loadMap (ajax)', errorCode: response.status });
      },
      success(response) {
        if (typeof (response) === 'string') {
          game.map = $j.parseJSON(response);
        } else {
          game.map = response;
        }

        game.map.tileProperties = game.map.tilesets[0].tileproperties;

        game.map.getTileIndexByCoords = function (x, y) {
          return y * this.width + x;
        };

        game.map.getTileTypeByCoords = function (x, y) {
          const arrayIndex = this.getTileIndexByCoords(x, y);
          return this.layers[0].data[arrayIndex];
        };

        game.map.getCoordsByTileIndex = function (i) {
          return new Coordinates(
            i % game.map.width,
            Math.floor(i / game.map.width)
          );
        };

        game.map.changeTileType = function (x, y, type) {
          const arrayIndex = this.getTileIndexByCoords(x, y);
          game.map.layers[0].data[arrayIndex] = type;
        };

        for (let i = 0; i < game.map.tilesets.length; i += 1) {
          game.map.tilesets[i].indexWidth = game.map.tilesets[0].imagewidth / game.map.tilesets[0].tilewidth;
          game.map.tilesets[i].indexHeight = game.map.tilesets[0].imageheight / game.map.tilesets[0].tileheight;
        }

        game.map.isInBounds = function (coords) {
          return coords.x >= 0
            && coords.x < game.map.width
            && coords.y > 0
            && coords.y < game.map.height;
        };

        game.map.mdMap = getMultiDimensionalMap(game.map.layers[0].data, game.map.width);

        game.map.pixelWidth = game.map.width * 32;
        game.map.pixelHeight = game.map.height * 32;

        // Put player on start tile.
        player.position = game.map.getCoordsByTileIndex(game.map.layers[0].data.indexOf(TileCodes.start));

        // Load items.
        game.items = [];
        game.iDataArray = Utility.array.findByProperty(game.map.layers, 'name', 'Items', true);

        if (game.iDataArray !== null) {
          for (let i = 0; i < game.iDataArray.objects.length; i += 1) {
            const iData = game.iDataArray.objects[i];
            const item = new Sprite.Sprite(game, null, draw);

            item.tileGraphic = iData.gid;
            item.spriteID = `item ${i}`;
            item.nameID = iData.name;
            item.type = 'item';

            if (game.map.tileProperties[iData.gid - 1] === null) {
              if (game.debug) {
                Utility.console.log(`NULL:  ${iData.gid}`);
              }
            }
            item.subType = game.map.tileProperties[iData.gid - 1].type;
            if (game.debug) {
              Utility.console.log(item.subType);
            }
            item.imageType = 'tile';
            item.color = game.map.tileProperties[iData.gid - 1].color;
            item.position = new Coordinates((iData.x) / 32, (iData.y - 32) / 32);
            item.linksTo = iData.properties.linksTo;

            item.message = iData.properties.Text;

            item.callback = iData.properties.callback;
            item.destroyOnUse = iData.properties.destroyOnUse === 'true';

            game.items.push(item);

            if (typeof (iData.properties.destination) !== 'undefined') {
              item.destination = iData.properties.destination;
            }
          }
        }

        // Count money.
        game.moneyCount = Utility.array.findAllByProperty(game.items, 'subType', 'money', true).length;

        // Load enemies.
        game.enemies = [];

        game.eDataArray = Utility.array.findByProperty(game.map.layers, 'name', 'Enemies', true);
        if (game.eDataArray !== null) {
          for (let i = 0; i < game.eDataArray.objects.length; i += 1) {
            const eData = game.eDataArray.objects[i];
            const enemy = new Sprite.Sprite(game, null, draw);

            enemy.tileGraphic = eData.gid;
            enemy.spriteID = `enemy ${i}`;
            enemy.nameID = eData.name;
            enemy.type = 'enemy';
            enemy.subType = game.map.tileProperties[eData.gid - 1].type;
            enemy.imageType = 'tile';
            enemy.position = new Coordinates(eData.x / 32, (eData.y - 32) / 32);
            enemy.speed = game.defaultEnemySpeed;

            // Change initial enemy facing direction.
            if (typeof (eData.properties.direction) !== 'undefined') {
              enemy.direction = eData.properties.direction;
              if (enemy.subType === 'player2') {
                enemy.rotation = enemy.getRotation();
              }
            }

            if (typeof (eData.properties.autoMove) !== 'undefined') {
              enemy.autoMove = eData.properties.autoMove === 'true';
            }

            if (enemy.subType === 'smartPredator') {
              enemy.speed = 3;
            }

            game.enemies.push(enemy);
          }
        }

        game.tools = [];

        game.tDataArray = Utility.array.findByProperty(game.map.layers, 'name', 'Tools', true);
        if (game.tDataArray !== null) {
          for (let i = 0; i < game.tDataArray.objects.length; i += 1) {
            const tData = game.tDataArray.objects[i];
            const tool = new Sprite.Sprite(game, null, draw);

            tool.tileGraphic = tData.gid;
            tool.spriteID = `tool ${i}`;
            tool.type = 'tool';
            tool.subType = game.map.tileProperties[tData.gid - 1].type;
            tool.imageType = 'tile';
            tool.color = game.map.tileProperties[tData.gid - 1].color;
            tool.position = new Coordinates(tData.x / 32, (tData.y - 32) / 32);

            // Change initial enemy facing direction.
            if (typeof (tData.properties.direction) !== 'undefined') {
              tool.direction = tData.properties.direction;
            }

            game.tools.push(tool);
          }
        }

        // TODO: Refactor parameters. Make it freaking consistent.

        const p = Utility.array.findByProperty(game.map.layers, 'name', 'Parameters', true);

        // Defaults. Will be overridden below if replacement parameters exist.
        game.map.parameters = {
          wrapAround: false,
          tileset: 'devgraphics',
        };
        stage.isOffset = true;
        game.mode = 'normal';
        game.password = password[game.level];
        game.nextLevelNumber = game.level + 1;

        if (p !== null && typeof (p.properties) !== 'undefined') {
          game.map.parameters = p.properties;

          if (typeof (p.properties.stageOffset) !== 'undefined') {
            if (p.properties.stageOffset === 'false') {
              stage.isOffset = false;
            }
          }

          if (typeof (p.properties.tileset) !== 'undefined') {
            game.map.parameters.tileset = p.properties.tileset;
          } else {
            game.map.parameters.tileset = 'devgraphics';
          }

          if (typeof (p.properties.mode) !== 'undefined') {
            game.mode = p.properties.mode;
          }

          if (typeof (p.properties.password) !== 'undefined') {
            game.password = p.properties.password;
          }

          if (typeof (p.properties.nextLevel) !== 'undefined') {
            game.nextLevelNumber = p.properties.nextLevel;
          }

          if (typeof (p.properties.tileset) !== 'undefined') {
            game.map.parameters.tileset = p.properties.tileset;
          }

          if (typeof (p.properties.time) !== 'undefined') {
            game.clock = parseInt(p.properties.time, 10);
          }
        }
      },
    });
  }

  // TODO: Refactor as class.
  const gameHudClass = function () {
    this.backgroundColor = '';
    this.textColor = '';
    this.messageBox = {};
    this.messageBox.backgroundColor = '';
    this.messageBox.textColor = '';

    this.Draw = function () {
      if (game.map.parameters.tileset === 'dungeon') {
        this.backgroundColor = 'rgb(50,20,10)';
        this.textColor = 'rgb(225,225,185)';
        this.messageBox.backgroundColor = 'rgb(99,40,30)';
        this.messageBox.textColor = 'rgb(200,180,170)';
      } else {
        this.backgroundColor = 'rgb(230,230,200)';
        this.textColor = 'rgb(0,0,0)';
        this.messageBox.backgroundColor = 'rgb(210,205,235)';
        this.messageBox.textColor = 'rgb(0,0,0)';
      }

      // Draw background.
      this.draw.ctx.fillStyle = this.backgroundColor;
      this.draw.ctx.fillRect(stage.hudCoords.x, stage.hudCoords.y, stage.hudWidth, stage.hudHeight);

      this.draw.ctx.fillStyle = this.textColor;

      if (game.mode === 'normal') {
        this.DrawNormalHud();
      } else if (game.mode === 'title') {
        this.drawTitle();
      } else if (game.mode === 'password') {
        this.drawPassword();
      }
    };

    this.drawTitle = function () {
      this.draw.ctx.save();
      this.draw.ctx.font = '28px sans-serif';

      this.draw.ctx.fillText('Jake\'s Journey', 500, 20);

      this.draw.ctx.font = '20px sans-serif';
      this.draw.ctx.wrapText('Press ENTER to begin.\nPress X to enter password.', 500, 80, 270, 30);
      this.draw.ctx.restore();
    };

    this.drawPassword = function () {
      this.draw.ctx.save();
      this.draw.ctx.font = '28px sans-serif';
      this.draw.ctx.fillStyle = this.textColor;
      this.draw.ctx.wrapText('Jake\'s Journey', 500, 20, 270, 40);

      this.draw.ctx.font = '24px sans-serif';
      this.draw.ctx.wrapText('Enter Password.', 500, 60, 270, 40);

      // Text box.
      this.draw.ctx.fillStyle = 'white';
      this.draw.ctx.font = '20px sans-serif';
      this.draw.ctx.fillRect(500, 90, stage.hudWidth - 60, 26);

      // Cursor
      this.draw.ctx.fillStyle = 'rgb(0,255,255)';
      this.draw.ctx.fillRect(505 + this.draw.ctx.measureText(enteredPassword).width, 93, 15, 20);

      this.draw.ctx.fillStyle = 'rgb(0,0,0)';
      this.draw.ctx.fillText(enteredPassword, 505, 92);

      // Message.
      if (game.passwordHudMessage.length > 0) {
        this.draw.ctx.save();
        this.draw.ctx.fillStyle = 'rgb(255,0,0)';
        this.draw.ctx.fillText(game.passwordHudMessage, 500, 118);
        this.draw.ctx.restore();
      }

      this.draw.ctx.wrapText('Press ENTER to submit.\nPress ESC to return to title.', 500, 160, 270, 30);

      this.draw.ctx.restore();
    };

    this.DrawNormalHud = function () {
      let drawLevel = game.level;
      if (drawLevel === 54) {
        drawLevel = 27;
      } else if (drawLevel === 53) {
        drawLevel = 1;
      }

      // Draw level text.
      this.draw.ctx.fillStyle = this.textColor;
      this.draw.ctx.fillText(`Level  ${drawLevel}`, 500, 20);

      // Draw game clock.
      if (game.clock > -1) {
        this.draw.ctx.fillText(`Time:  ${game.clock}`, 620, 20);
      } else {
        this.draw.ctx.fillText('Time: \u221E', 620, 20);
      }

      // Draw password.
      this.draw.ctx.fillText(`Password: ${game.password}`, 500, 50);

      // Draw money count:
      let interval = Math.floor(273 / game.moneyCount);
      interval = Math.min(interval, 13);
      for (let i = 0; i < game.moneyCount; i += 1) {
        if (i < player.inventory.money) {
          // Collected money:
          draw.drawTileAbsolute(TileCodes.coin, new Coordinates(495 + (i * interval), 80));
        } else {
          // Uncollected money:
          draw.drawTileAbsolute(TileCodes.coinUncollected, new Coordinates(495 + (i * interval), 80));
        }
      }

      // Draw keys.
      let keyDrawIndex = 0;
      const totalKeys =
        player.inventory.yellowKeys +
        player.inventory.redKeys +
        player.inventory.cyanKeys +
        player.inventory.greenKeys;
      const keyInterval = (totalKeys < 9)
        ? 32
        : Math.floor(273 / (totalKeys));

      // Draw yellow key inventory.
      for (let i = 0; i < player.inventory.yellowKeys; i += 1) {
        draw.drawTileAbsolute(TileCodes.yellowKey,
          new Coordinates(500 + (keyDrawIndex * keyInterval), 110));
        keyDrawIndex += 1;
      }

      // Draw red key inventory.
      for (let i = 0; i < player.inventory.redKeys; i += 1) {
        draw.drawTileAbsolute(TileCodes.redKey,
          new Coordinates(500 + (keyDrawIndex * keyInterval), 110));
        keyDrawIndex += 1;
      }

      // Draw cyan key inventory.
      for (let i = 0; i < player.inventory.cyanKeys; i += 1) {
        draw.drawTileAbsolute(TileCodes.cyanKey,
          new Coordinates(500 + (keyDrawIndex * keyInterval), 110));
        keyDrawIndex += 1;
      }

      // Draw green key inventory.
      for (let i = 0; i < player.inventory.greenKeys; i += 1) {
        draw.drawTileAbsolute(
          TileCodes.greenKey,
          new Coordinates(500 + (keyDrawIndex * keyInterval), 110)
        );
        keyDrawIndex += 1;
      }

      // Draw help message.
      if (game.showMessage) {
        this.draw.ctx.save();
        this.draw.ctx.fillStyle = this.messageBox.backgroundColor;
        this.draw.ctx.font = '12px sans-serif';
        this.draw.ctx.fillRect(500, 160, 280, 200);
        this.draw.ctx.fillStyle = this.messageBox.textColor;
        this.draw.ctx.wrapText(game.messageText, 510, 170, 270, 18);
        this.draw.ctx.restore();
      }

      if (game.isPaused) {
        this.draw.ctx.save();

        // Draw shade over game.
        this.draw.ctx.save();
        this.draw.ctx.fillStyle = 'rgba(0,0,0,0.5)';
        this.draw.ctx.fillRect(0, 0, stage.playboxWidth, stage.playboxHeight);
        this.draw.ctx.restore();

        // Draw pause box.
        this.draw.ctx.save();
        this.draw.ctx.fillStyle = 'red';
        this.draw.ctx.fillRect(20, 20, 274, 97);
        this.draw.ctx.fillStyle = 'rgb(50,50,50)';
        this.draw.ctx.fillRect(21, 21, 272, 95);
        this.draw.ctx.restore();

        // Draw pause text.
        this.draw.ctx.save();
        this.draw.ctx.fillStyle = 'red';
        this.draw.ctx.font = '20px sans-serif';
        this.draw.ctx.wrapText('PAUSED.\n\nPress P to resume.\nPress Enter to restart level.', 26, 26, 270, 22);
        this.draw.ctx.restore();

        this.draw.ctx.restore();
      }
    };
  };
  // TODO: Refactor.
  const creditsTextClass = function (text, color, font, alpha, speed, delay, y) {
    this.text = text || '';
    this.color = color || '';
    this.font = font || '';
    this.alpha = alpha || 0;
    this.speed = speed || 0;
    this.delay = (delay / 20) || 0;
    this.y = y || 0;

    this.alphaIncrement = (this.speed > 0)
      ? 5 / this.speed
      : 1;
  };

  const creditsClass = function () {
    this.creditsArray = [
      // new creditsTextClass('Jake's Journey', '255,255,255', '28px sans-serif', 0, 4000, 4000, 70),
      new creditsTextClass('Created by Jacob King', '220,220,230', '24px sans-serif', 0, 4000, 4500, 120),

      new creditsTextClass('Credits', '200,200,210', '16px sans-serif', 0, 1000, 600, 170),
      new creditsTextClass('Beta Testers: Aaron King / Molly King / Matt Moyer', '200,200,210', '16px sans-serif', 0, 500, 400, 200),
      new creditsTextClass('Additional story elements by Molly and Aaron.', '200,200,210', '16px sans-serif', 0, 500, 400, 220),
      // new creditsTextClass('', '200,200,210', '16px sans-serif', 0, 1000, 300, 270),
      new creditsTextClass('Dedicated to Molly. Thanks for the push.', '200,200,210', '16px sans-serif', 0, 500, 2500, 260),

      new creditsTextClass('Press enter to return to title.', '140,250,30', '12px sans-serif', 0, 0, 0, 330),

    ];

    this.creditsFinished = false;

    this.isStarted = false;
    this.sequence = 0;

    this.fadeOut = 0;

    this.update = function () {
      this.doFadeOut();

      this.fadeInCredits();
    };

    this.doFadeOut = function () {
      if (this.sequence === 0) {
        // Fadeout sequence.
        if (this.fadeOut < 1) {
          this.fadeOut += 0.005;
        } else {
          this.sequence += 1;
        }
      } else {
        this.fadeOut = 1;
      }
    };

    this.fadeInCredits = function () {
      if (this.creditsFinished) {
        if (this.sequence === 1) {
          this.sequence += 1;
        }
        return;
      }

      if (this.sequence >= 1) {
        let canFinish = true;

        for (let i = 0; i < this.creditsArray.length; i += 1) {
          const cred = this.creditsArray[i];

          if (this.sequence === 1) {
            if (i > 0) {
              if (this.creditsArray[i - 1].delay > 0) {
                continue;
              }
            }

            if (cred.alpha < 1) {
              cred.alpha += cred.alphaIncrement;
            }

            if (cred.delay > 0) {
              cred.delay -= 1;
            }
          } else if (this.sequence >= 2) {
            cred.alpha = 1;
            cred.delay = 0;
          }

          if (cred.delay > 0 || cred.alpha < 1) {
            canFinish = false;
          }
        } // for

        if (canFinish) {
          this.creditsFinished = true;
        }
      } // this.sequence >= 1;
    };

    this.Draw = function () {
      if (game.mode === 'credits') {
        this.draw.ctx.save();

        // Draw black bg.
        if (this.sequence >= 0) {
          this.draw.ctx.fillStyle = `rgba(0,0,0, ${this.fadeOut})`;
          this.draw.ctx.fillRect(0, 0, stage.width, stage.height);
        }
        if (this.sequence >= 1) {
          for (let i = 0; i < this.creditsArray.length; i += 1) {
            const cred = this.creditsArray[i];
            this.draw.ctx.fillStyle = `rgba(${cred.color}, ${cred.alpha})`;
            this.draw.ctx.font = cred.font;
            this.draw.ctx.centerText(cred.text, 0, stage.width, cred.y);
          }
        }

        this.draw.ctx.restore();
      }
    };
  };

  const gameObject = function () {
    this.debug = false;
    this.betaTest = false;
    this.gameTimer = -1;
    this.clock = -1;
    this.level = -1;
    this.nextLevelNumber = 0;
    this.setLevelClock = function () {
      this.clock = Math.floor(this.gameTimer / 50);
    };
    this.atExit = false;
    this.winMessage = null;
    this.theEnd = false;

    this.restartLevel = function () {
      loadMap(game.level);
    };

    this.nextLevel = function () {
      this.level = game.nextLevelNumber;
      this.atExit = false;
      player.inventory = new Sprite.Inventory();
      loadMap(this.level);
    };

    this.returnToTitle = function () {
      this.level = -1;
      this.nextLevelNumber = 0;
      this.winMessage = null;
      this.theEnd = false;
      this.mode = 'title';
      this.nextLevel();
    };

    this.hud = new gameHudClass();
    this.credits = new creditsClass();

    this.iDataArray = null;
    this.items = null;

    this.eDataArray = null;
    this.enemies = null;

    this.tools = null;

    this.showMessage = false;
    this.messageText = '';

    this.mode = 'normal';

    this.password = '';

    // Todo: refactor 'isPaused' into 'game.mode = 'paused'
    this.isPaused = false;

    this.moneyCount = 0;

    this.redSwitch = false;
    this.yellowSwitch = false;
    this.greenSwitch = false;
    this.brownSwitch = false;

    this.onQuickCorruptTile = false;
    this.quickCorruptTriggered = false;
    this.corruption = 0;
    this.corruptionTimer = 0;

    this.deathCount = 0;

    this.setDeadMessage = function (message) {
      this.deathCount += 1;
      this.showMessage = true;
      if (this.deathCount % 10 === 0) {
        message = DeathMessages.miscDeath.getRandomElement();
      }
      this.messageText = `${message}\n\nPress enter to restart.`;
    };

    this.passwordHudMessage = '';

    this.defaultEnemySpeed = 8;

    this.fadeOut = 0;
  };

  function generateGridLines() {
    const gridLines = [];

    for (let x = 0; x <= stage.width; x += 32) {
      const coord = [x + 0.5, 0.5, x + 0.5, stage.height + 0.5];
      if (x === stage.width) {
        coord[0] -= 1;
        coord[2] -= 1;
      }
      gridLines.push(coord);
    }
    for (let y = 0; y <= stage.height; y += 32) {
      const coord = [0.5, y + 0.5, stage.width + 0.5, y + 0.5];
      if (y === stage.height) coord[3] -= 1;
      gridLines.push(coord);
    }
    return gridLines;
  }

  function doPreWork(bypassTouchscreen) {
    if (!bypassTouchscreen) {
      // Don't run game on touchscreen devices.
      if (('ontouchstart' in window) || window.navigator.msMaxTouchPoints > 0) {
        $j('#main').before('<div class="errorPanel"><h1><p>Notice: This game requires a physical keyboard to play. Touchscreen is not supported.</p><p>If you are using a hybrid, touchscreen-keyboard-combination device (such as Microsoft Surface), press Enter on your physical keyboard to bypass this message and continue to the game. (This feature is untested! You are a pioneer!)</p></div>');

        $j(window).keydown(bypass);

        return false;
      }
    }

    $j('.errorPanel').remove();

    // Check for browser support.
    if (!Modernizr.fontface || Array.prototype.indexOf === undefined || !window.HTMLCanvasElement) {
      $j('#main').before('<div class="errorPanel"><h1>Your browser does not have the capabilities to run this game.</h1><p>Please consider installing <a href="http://www.google.com/chrome">Google Chrome</a>. Hey, <strong>I</strong> use it, and look how I turned out.</p></div>');
      $j('#main').hide();
      return false;
    }

    // Check for file:///
    if (window.location.protocol === 'file:') {
      $j('#main').before('<div class="errorPanel"><h1>Running this game directly from the filesystem is unsupported.</h1><p>You are running this game directly from your filesystem. (file:///). This won\'t work, because file:/// doesn\'t support AJAX, and this game needs AJAX to load the levels. Instead, you can install NodeJS and run this game using \'npm start dev\', or you can spin up your own local web server and host this project in there.</p></div>');
      $j('#main').hide();
      return false;
    }

    // Turn off padding to make game fit in small monitors.
    $j('#main').css('padding', '0px');

    master = $j('.master');
    // master.css('backgroundColor','white');

    stage = new stageObject();
    stage.init();
    game = new gameObject();

    // Define assets.
    assets.face = document.getElementById('face');
    assets.devgraphics = document.getElementById('devgraphics');
    assets.dungeon = document.getElementById('dungeon');
    assets.gridLineCoordinates = generateGridLines();

    const keyboard = new Keyboard();
    keyboard.settings.exclusions = ['F5', 'F11', 'F12', 'Control'];
    keyboard.wireUp(document);

    player = new Sprite.Sprite(game, keyboard, draw);
    player.imageType = 'image';
    player.image = assets.face;
    player.type = 'player';

    draw = new Draw(game, stage, player, assets);

    player.draw = draw;

    return true;
  }

  function Update() {
    // Reset message box visibility.
    game.showMessage = false;

    if (game.mode === 'credits') {
      game.credits.update();
      return;
    }

    if (game.atExit) {
      if (game.theEnd) {
        if (game.credits.isStarted === false) {
          // Credits sequence!
          game.mode = 'credits';
          game.credits.isStarted = true;
        }
      } else {
        // Todo: Different messages for dungeon levels!
        game.showMessage = true;
        if (game.winMessage === null) {
          game.winMessage = `${DeathMessages.win.getRandomElement()}\n\nPress Enter to continue.`;
        }
        game.messageText = game.winMessage;
      }

      return;
    }

    game.gameTimer += 1;

    if (game.gameTimer % 50 === 0) {
      if (game.clock > -1) {
        game.clock -= 1;
      }
    }

    if (!player.isDead) {
      // Must update tools before updating enemies to prevent pushblock bug.
      for (let i = 0; i < game.tools.length; i += 1) {
        game.tools[i].Update();
      }

      for (let i = 0; i < game.enemies.length; i += 1) {
        game.enemies[i].Update();
      }
    }
  }

  function CheckCollision() {
    game.redSwitch = false;
    game.yellowSwitch = false;
    game.greenSwitch = false;
    game.onQuickCorruptTile = false;

    // Register item hits.
    for (let i = 0; i < game.items.length; i += 1) {
      if (player.position.x === game.items[i].position.x && player.position.y === game.items[i].position.y) {
        // Player interacts with item.
        game.items[i].registerHit(player);
        continue;
      }

      for (let j = 0; j < game.enemies.length; j += 1) {
        const enemy = game.enemies[j];

        if (enemy.position.x === game.items[i].position.x && enemy.position.y === game.items[i].position.y) {
          // Enemy interacts with item.
          game.items[i].registerHit(enemy);
          continue;
        }
      }

      for (let j = 0; j < game.tools.length; j += 1) {
        const tool = game.tools[j];

        if (Utility.areSpritesColliding(tool, game.items[i])) {
          // Enemy interacts with item.
          game.items[i].registerHit(tool);
          continue;
        }
      }
      continue;
    }

    // Register enemy hits.
    for (let i = 0; i < game.enemies.length; i += 1) {
      if (player.position.x === game.enemies[i].position.x && player.position.y === game.enemies[i].position.y) {
        player.isDead = true;
        game.enemies[i].hasKilledPlayer = true;

        let message = '';
        if (typeof (DeathMessages[game.enemies[i].subType]) !== 'undefined') {
          message = DeathMessages[game.enemies[i].subType].getRandomElement();
        } else {
          message = `BUG!\n\nThe game has registered you as dead. If you're seeing this message, it's a bug in the level. Contact Jake and tell him that he accidentally put a(n) ${game.enemies[i].subType} in the Enemy array (which is why you died when you touched it). )`;
        }

        game.setDeadMessage(message);
      }
    }

    if (game.clock === 0) {
      player.isDead = true;
      const message = DeathMessages.time.getRandomElement();
      game.setDeadMessage(message);
    }

    // Countdown timer for remaining quick corruption.
    if (game.corruptionTimer > 0) {
      game.corruptionTimer -= 1;
    } else if (game.incrementCorruption) {
      // Permanent corruption.
      game.corruption += 1;

      if (game.atExit && game.corruption < 52) {
        game.corruptionTimer = 10;
      } else {
        game.corruptionTimer = 50;
      }

      if (game.corruption > 58) {
        game.incrementCorruption = false;
        game.nextLevel();
      }
    } else {
      // Quick corruption.
      game.corruption = 0;
    }

    player.crushCheck();
  }

  function gameLoop() {
    player.GetInput();
    if (!player.isDead && !game.isPaused) {
      Update();
      CheckCollision();
    }
    draw.beginDraw();
  }
  function run(bypassTouchscreen) {
    if (gameInterval !== null) {
      window.clearInterval(gameInterval);
    }

    if (bypassTouchscreen === null) {
      bypassTouchscreen = false;
    }
    const continueRunning = doPreWork(bypassTouchscreen);
    if (!continueRunning) { return; }

    game.nextLevel();

    // Game Loop.
    gameInterval = setInterval(gameLoop, 20);
  }

  bypass = function (e) {
    if (e.keyCode === 13) {
      $j(window).off('keydown', bypass);
      run(true);
    }
  };

  $j(() => {
    run(false);
  });
});
