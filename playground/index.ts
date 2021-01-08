import PIXI, {Application} from 'pixi.js';
import {Docker, Entity, Scene} from '../src';
import {EventType} from './types';
import {BorderLimit, FollowMouse} from './traits';

// disable interpolation when scaling, will make texture be pixelated
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const sprite = PIXI.Sprite.from('white_block.png');

class Level extends Scene<EventType> {
  constructor() {
    super();

    const player = new Entity<EventType>(sprite, [0, 0], [32, 32]);
    player.addTrait(new BorderLimit());
    player.addTrait(new FollowMouse());
    player.velocity = [300, 0];

    this.addChild(player);
    console.log(this);
  }
}

const app = new Application({
  backgroundColor: 0x161e21,
  antialias: false,
  resizeTo: window,
});

document.body.appendChild(app.view);

const docker = new Docker<EventType>(app);
const level = new Level();

docker.mount(level);
docker.on('docker/mount', () => {
  console.log('crazy wacky cool!');
});
