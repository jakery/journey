define(
  'Player',
  ['./Sprite'],
  Sprite => function Player(
    game,
    stage,
    keyboard,
    draw,
    passwordHandler,
    image
  ) {
    const player = new Sprite.Sprite(
      game,
      stage,
      keyboard,
      draw,
      passwordHandler,
      null
    );
    player.imageType = 'image';
    player.image = image;
    player.type = 'player';
    player.player = player;
    return player;
  });
