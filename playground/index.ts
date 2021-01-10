import PIXI, {Application} from 'pixi.js';
import {Docker, Entity, Scene} from '../src';
import {AddonsType, EventsType, PlayerTraits} from './types';
import {BorderLimit, FollowMouse} from './traits';
import {Animation, Entities} from './addons';

// disable interpolation when scaling, will make texture be pixelated
PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

const sprite = PIXI.Sprite.from('white_block.png');

class Level extends Scene<AddonsType, EventsType> {
  constructor() {
    super({
      entities: new Entities(),
      animation: new Animation(),
    });

    const player = new Entity<AddonsType, PlayerTraits, EventsType>(sprite, {
      followMouse: new FollowMouse(10),
      borderLimit: new BorderLimit(),
    });

    player.width = 32;
    player.height = 32;
    player.velocity = [300, 0];

    this.addChild(player);
    this.addon.entities.addChild(player);
    this.addon.animation.animate();

    console.log(this);
  }
}

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
