import PIXI, {Application} from 'pixi.js';
import {Docker} from '../src';
import {AddonsType, EventsType} from './types';
import {Level} from './Level';

// disable interpolation when scaling, will make texture be pixelated
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const app = new Application({
  backgroundColor: 0x161e21,
  antialias: false,
  resizeTo: window,
});

document.body.appendChild(app.view);

const docker = new Docker<AddonsType, EventsType>(app);
const level = new Level();

docker.mount(level);
docker.on('docker/mount', () => {
  console.log('crazy wacky cool!');
});

console.log(level);
