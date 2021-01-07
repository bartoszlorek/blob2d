import PIXI, {Application} from 'pixi.js';
import {Docker, Element, Scene} from '../src';
import {EventType, ContextType} from './types';

// disable interpolation when scaling, will make texture be pixelated
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const sprite = PIXI.Sprite.from('white_block.png');

class Level extends Scene<EventType> {
  private playerX: number;
  private context: ContextType;

  constructor() {
    super();

    this.playerX = 0;
    this.context = {
      player: this.addChild(new Element(sprite)),
    };
  }

  update(deltaFrame: number) {
    this.context['player'].sprite.x = ++this.playerX * 5;
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
}, 2500);

// level.on('player/score', () => {
//   console.log('crazy wacky cool!');
// });
