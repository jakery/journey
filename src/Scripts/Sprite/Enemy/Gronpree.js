const EnemyAbstract = require('./EnemyAbstract');

define('Gronpree', [], () => {
  function Gronpree(...args) {
    EnemyAbstract.call(this, ...args);

    this.updateMovementPattern = function updateMovementPattern() {
      /*
        Move forward until hit obstacle.

        In event of obstacle:
        Try turning clockwise, then counter clockwise, then going in reverse.

        In event of next obstacle:
        Try turning counterclockwise, then clockwise, then going in reverse.

        Switch back and forth between counterclockwise
          and clockwise preference on every obstacle encountered.
      */
      if (this.game.gameTimer % this.speedModulus) {
        return false;
      }

      if (!this.canMove()) {
        if (!this.isPreferringClockwise) {
          this.turnAntiClockwise();
          if (!this.canMove()) {
            this.turnAround();
            if (!this.canMove()) {
              this.turnProClockwise();
            }
          } else {
            this.isPreferringClockwise = this.isPreferringClockwise.toggle();
          }
        } else {
          this.turnProClockwise();
          if (!this.canMove()) {
            this.turnAround();
            if (!this.canMove()) {
              this.turnAntiClockwise();
            }
          } else {
            this.isPreferringClockwise = this.isPreferringClockwise.toggle();
          }
        }
      }

      this.goForward();
      return null;
    };

    this.deathMessages = [
      'Vous avez été renversé par une Peugeot. \n Oh là là!',
      'Pas plus de baguettes pour vous.',
      'Regarde des deux côtés avant de traverser la rue.',
      `Jacques Cousteau a exploré le fond de l'occean. Vous explorez la partie inférieure d'une voiture.`,
      `Do you hear the people sing?\
      Singing a song as engines rev\
      It is the music of my road rage\
      As I hit and run again`,
      // TODO: Retranslate all entries below this line.
      'Ma femme était censé écrire ces messages, mais elle est collée au Canada sans pauses salle de bains.\n(Présenté par Google Translate.)',
      'Vous rappelez-vous l\'époque où Erique préparé un délicieux coq au vin pour sa famille? C\'est la même chose, sauf que tu es mort.\n(Présenté par Google Translate)',
      'Si nous avons roulé comme ça plus souvent, nous n\'aurions pas perdu toutes les guerres jamais.\n(Présenté par Google Translate)',
      'Je suis français. Je viens vous écrasé avec ma voiture. Sentez mes aisselles. Oui, oui!\n(Présenté par Google Translate)',
      'Comment dites que vous ne "Sortez de la manière." en anglais? Vous n\'avez pas. Vous continuez à conduire. :)\n(Présenté par Google Translate)',
    ];
  }

  // Inherit EnemyAbstract class.
  Gronpree.prototype = Object.create(EnemyAbstract.prototype);
  Gronpree.prototype.constructor = Gronpree;
  return Gronpree;
});
