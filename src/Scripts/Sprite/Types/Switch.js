define('Switch', ['../Sprite'], Sprite => function SwitchModule(
  game,
  stage,
  keyboard,
  draw,
  passwordHandler,
  image
) {
  const switchSprite = new Sprite.Sprite(
    game,
    stage,
    keyboard,
    draw,
    passwordHandler,
    null
  );
  switchSprite.imageType = 'image';
  switchSprite.image = image;
  switchSprite.type = 'switch';
  switchSprite.player = player;
  switchSprite.registerHit =
  return switchSprite;
});
