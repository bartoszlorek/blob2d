import PIXI, {Application, Loader} from 'pixi.js';
import {Docker} from '../src';
import {Addons, Events} from './types';
import {setupGui} from './gui';
import {Level} from './Level';

// disable interpolation when scaling, will make texture be pixelated
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const loader = new Loader();
const app = new Application({
  backgroundColor: 0x68aed4,
  antialias: false,
  resizeTo: window,
});

document.body.appendChild(app.view);

loader.add('sprites', './assets/sprites.png').load(() => {
  setupGui(); // possible implementation

  const docker = new Docker<Addons, Events>(app);
  const level = new Level(loader.resources);

  docker.mount(level);
});
