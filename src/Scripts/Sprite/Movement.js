define(
  'Movement',
  [
    '../Constants/Constants',
    '../Constants/TileCodes',
    '../Coordinates',
    './Orientation',
  ],
  (
    Constants,
    TileCodes,
    Coordinates,
    Orientation
  ) => {
    this.getRotation = direction => (((direction + 1) % 4) * 90) - 90;

    this.turn = function turn(sprite, direction) {
      const thisSprite = sprite;
      thisSprite.direction = direction;
      // TODO: Rotation is no longer needed.
      thisSprite.rotation = this.getRotation(direction);
    };

    this.turnAround = sprite =>
      this.turn(sprite, Orientation.behind(sprite.direction));

    this.turnAntiClockwise = sprite =>
      this.turn(sprite, Orientation.antiClockwise(sprite.direction));

    this.turnProClockwise = sprite =>
      this.turn(sprite, Orientation.proClockwise(sprite.direction));

    this.getTarget = function getTarget(direction, position, mapMaxCoords) {
      const targetPosition = new Coordinates(position.x, position.y);
      if (direction === Orientation.enums.left) {
        targetPosition.x -= 1;
        if (targetPosition.x < 0) {
          targetPosition.x = mapMaxCoords.x - 1;
        }
      } else if (direction === Orientation.enums.right) {
        targetPosition.x += 1;
        if (targetPosition.x >= mapMaxCoords.x) {
          targetPosition.x = 0;
        }
      } else if (direction === Orientation.enums.up) {
        targetPosition.y -= 1;
        if (targetPosition.y < 0) {
          targetPosition.y = mapMaxCoords.y - 1;
        }
      } else if (direction === Orientation.enums.down) {
        targetPosition.y += 1;
        if (targetPosition.y >= mapMaxCoords.y) {
          targetPosition.y = 0;
        }
      }
      return targetPosition;
    };

    this.goForward = function goForward(s, d) {
      const sprite = s;
      if (d != null) {
        sprite.turn(d);
      }
      if (!sprite.clipping || sprite.canMove()) {
        if (sprite.type === 'player') {
          sprite.game.quickCorruptTriggered = false;
        }
        sprite.position = sprite.getTarget();
        sprite.isTeleporting = false;
        sprite.checkTile();
      }
    };
  }
);
