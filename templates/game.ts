import PIXI, {Application} from 'pixi.js';
import {Docker} from 'blob2d';

import {maps} from './assets';
import {loader} from './loader';
import {Level} from './scenes';
import {Addons, Events} from './types';

// disable interpolation when scaling, will make texture be pixelated
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new Application({
  antialias: false,
  resizeTo: window,
});

document.body.appendChild(app.view);

loader.load(() => {
  const docker = new Docker<Addons, Events>(app);
  const level = new Level(maps.demo_01, loader.resources);

  docker.mount(level);
});
