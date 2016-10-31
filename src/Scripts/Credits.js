define('Credits', ['./Constants', './CreditsText'], (Constants, CreditsText) => function Credits(game, stage, draw) {
  this.game = game;
  this.stage = stage;
  this.draw = draw;
  this.creditsArray = [
    // new CreditsText('Jake's Journey', '255,255,255', '28px sans-serif', 0, 4000, 4000, 70),
    new CreditsText('Created by Jacob King', '220,220,230', '24px sans-serif', 0, 4000, 4500, 120),

    new CreditsText('Credits', '200,200,210', '16px sans-serif', 0, 1000, 600, 170),
    new CreditsText('Beta Testers: Aaron King / Molly King / Matt Moyer', '200,200,210', '16px sans-serif', 0, 500, 400, 200),
    new CreditsText('Additional story elements by Molly and Aaron.', '200,200,210', '16px sans-serif', 0, 500, 400, 220),
    // new CreditsText('', '200,200,210', '16px sans-serif', 0, 1000, 300, 270),
    new CreditsText('Dedicated to Molly. Thanks for the push.', '200,200,210', '16px sans-serif', 0, 500, 2500, 260),

    new CreditsText('Press enter to return to title.', '140,250,30', '12px sans-serif', 0, 0, 0, 330),

  ];

  this.creditsFinished = false;

  this.isStarted = false;
  this.sequence = 0;

  this.fadeOut = 0;

  this.update = function update() {
    this.doFadeOut();
    this.fadeInCredits();
  };

  this.doFadeOut = function doFadeOut() {
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

  this.fadeInCredits = function fadeInCredits() {
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
              // TODO: Refactor out this continue statement. Someday. No rush.
              // eslint-disable-next-line no-continue
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

  this.Draw = function Draw() {
    if (game.mode === Constants.gameModes.credits) {
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
}
);
