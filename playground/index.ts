import PIXI, {Application, Loader} from 'pixi.js';
import {Docker} from '../src';
import {AddonsType, EventsType} from './types';
import {Level} from './Level';

// disable interpolation when scaling, will make texture be pixelated
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const loader = new Loader();
const app = new Application({
  backgroundColor: 0x161e21,
  antialias: false,
  resizeTo: window,
});

document.body.appendChild(app.view);

loader.add('whiteBox', 'white_block.png').load(() => {
  const docker = new Docker<AddonsType, EventsType>(app);
  const level = new Level(loader);

  docker.on('docker/mount', () => {
    console.log('crazy wacky cool!');
  });

  docker.mount(level);
  console.log(level);
});
