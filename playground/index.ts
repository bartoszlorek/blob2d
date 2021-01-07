import PIXI, {Application} from 'pixi.js';
import {Docker, Entity, Scene} from '../src';
import {EventType, ContextType} from './types';

// disable interpolation when scaling, will make texture be pixelated
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const sprite = PIXI.Sprite.from('white_block.png');

class Level extends Scene<EventType> {
  private context: ContextType;

  constructor() {
    super();

    const player = this.addChild(new Entity<EventType>(sprite));
    player.velocity = [200, 200];
    this.context = {player};
  }

  update(deltaTime: number) {
    this.context.player.update(deltaTime);
  }
}

const app = new Application({
  backgroundColor: 0x161e21,
  antialias: false,
  resizeTo: window,
});

document.body.appendChild(app.view);

const docker = new Docker<EventType>(app);

setInterval(() => {
  const level = new Level();
  docker.mount(level);
}, 1000);

// docker.on('docker/mount', () => {
//   console.log('crazy wacky cool!');
// });
