define(
  'Movement',
  [
    '../Constants/Constants',
    '../Constants/TileCodes',
    '../Coordinates',
  ],
  (
    Constants,
    TileCodes,
    Coordinates
  ) => {
    this.enum = {
      behind: direction => (direction + 2) % 4,
      antiClockwise: direction => (direction + 3) % 4,
      proClockwise: direction => (direction + 1) % 4,
    };

    this.blockers = [{
      test: destinationTileType => destinationTileType === TileCodes.wall,
      callback: () => false,
    }];


    this.turn = function turn(sprite, direction) {
      const thisSprite = sprite;
      thisSprite.direction = direction;
      thisSprite.rotation = this.getRotation(direction);
    };

    this.turnAround = sprite =>
      this.turn(sprite, this.enum.behind(sprite.direction));

    this.turnAntiClockwise = sprite =>
      this.turn(sprite, this.enum.antiClockwise(sprite.direction));

    this.turnProClockwise = sprite =>
      this.turn(sprite, this.enum.proClockwise(sprite.direction));

    // TODO: Enumerate these.
    this.getRotation = function getRotation(direction) {
      switch (direction) {
        case Constants.directions.up:
          return 0;
        case Constants.directions.down:
          return 180;
        case Constants.directions.left:
          return -90;
        case Constants.directions.right:
          return 90;
        default:
          return null;
      }
    };

    this.getTarget = function getTarget(direction, position, mapMaxCoords) {
      const targetPosition = new Coordinates(position.x, position.y);
      if (direction === Constants.directions.left) {
        targetPosition.x -= 1;
        if (targetPosition.x < 0) {
          targetPosition.x = mapMaxCoords.x - 1;
        }
      } else if (direction === Constants.directions.right) {
        targetPosition.x += 1;
        if (targetPosition.x >= mapMaxCoords.x) {
          targetPosition.x = 0;
        }
      } else if (direction === Constants.directions.up) {
        targetPosition.y -= 1;
        if (targetPosition.y < 0) {
          targetPosition.y = mapMaxCoords.y - 1;
        }
      } else if (direction === Constants.directions.down) {
        targetPosition.y += 1;
        if (targetPosition.y >= mapMaxCoords.y) {
          targetPosition.y = 0;
        }
      }
      return targetPosition;
    };
  }
);
