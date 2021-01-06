import PIXI, {Application} from 'pixi.js';
import {Docker, Scene} from '../src';

// disable interpolation when scaling, will make texture be pixelated
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

class Level extends Scene {
  update(deltaFrame: number) {
    // console.log({deltaFrame});
  }
}

const app = new Application({
  backgroundColor: 0x161e21,
  antialias: false,
  resizeTo: window,
});

document.body.appendChild(app.view);

const docker = new Docker(app);
const level = new Level();

docker.mount(level);
