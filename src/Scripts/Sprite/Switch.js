// TODO: Check for items to decouple
define('Switch', ['./Sprite'], Sprite => function Switch(
  game,
  stage,
  keyboard,
  draw,
  passwordHandler,
  image
) {
  const switchSprite = new Sprite(
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
  switchSprite.player = game.player;
  switchSprite.registerHit = function registerHit() { };
  return switchSprite;
});
