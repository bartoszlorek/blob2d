import PIXI, {Application} from 'pixi.js';
import {Docker, Element, Scene} from '../src';
import {EventType, RefsType} from './types';

// disable interpolation when scaling, will make texture be pixelated
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

class Level extends Scene<EventType, RefsType> {
  playerSpriteX: number;

  constructor() {
    super();

    this.playerSpriteX = 0;
    this.refs['player'] = this.addChild(
      new Element(PIXI.Sprite.from('white_block.png'))
    );
  }

  update(deltaFrame: number) {
    if (this.refs['player']) {
      this.refs['player'].sprite.x = ++this.playerSpriteX;
    }
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

level.on('player/score', () => {
  console.log('crazy wacky cool!');
});
