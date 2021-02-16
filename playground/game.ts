import {Docker} from 'blob2d';
import PIXI, {Application} from 'pixi.js';
import {maps} from './assets';
import {setupGui} from './gui';
import {loader} from './loader';
import {Level} from './scenes';
import {Addons, Events} from './types';

// disable interpolation when scaling, will make texture be pixelated
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new Application({
  backgroundColor: 0x68aed4,
  antialias: false,
  resizeTo: window,
});

document.body.appendChild(app.view);

loader.load(() => {
  setupGui(); // possible implementation

  const docker = new Docker<Addons, Events>(app);
  const level = new Level(maps.demo_01, loader.resources);
  docker.mount(level);
});
