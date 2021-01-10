import {Entity, Scene} from '../src';
import {AddonsType, EventsType, PlayerTraits} from './types';
import {Animation, Entities} from './addons';
import {BorderLimit, FollowMouse} from './traits';

const sprite = PIXI.Sprite.from('white_block.png');

export class Level extends Scene<AddonsType, EventsType> {
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
  }
}
