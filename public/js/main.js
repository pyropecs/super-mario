import { loadLevel } from "./loaders.js";
import { loadMarioSprites, loadBackgroundSprites } from "./sprites.js";
import Compositor from "./compositor.js";

import { createBackgroundLayer } from "./layers.js";

const canvas = document.querySelector("#screen");
const context = canvas.getContext("2d");

function createSpriteLayer(sprite, pos) {
  return function drawSpriteLayer(context) {
    for (let i = 0; i < 20; i++) {
      sprite.draw("idle", context, pos.x + i * 16, pos.y);
    }
    sprite.draw("idle", context, pos.x, pos.y);
  };
}

Promise.all([
  loadMarioSprites(),
  loadBackgroundSprites(),
  loadLevel("1-1"),
]).then(([marioSprites, backgroundSprites, level]) => {
  const comp = new Compositor();
  const backgroundLayer = createBackgroundLayer(
    level.backgrounds,
    backgroundSprites
  );

  comp.layers.push(backgroundLayer);

  const pos = {
    x: 0,
    y: 0,
  };
  const spriteLayer = createSpriteLayer(marioSprites, pos);
  comp.layers.push(spriteLayer);

  function update() {
    comp.draw(context);

    marioSprites.draw("idle", context, pos.x, pos.y);
    pos.x += 2;
    pos.y += 2;
    requestAnimationFrame(update);
  }

  update();
});
