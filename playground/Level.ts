import {Sprite, IResourceDictionary} from 'pixi.js';
import {Entity, Scene, Tilemap} from '../src';
import {AddonsType, EventsType, PlayerTraits} from './types';
import {Animation, Entities} from './addons';
import {BorderLimit, FollowMouse} from './traits';

export class Level extends Scene<AddonsType, EventsType> {
  constructor(resources: IResourceDictionary) {
    super();

    this.registerAddons({
      entities: new Entities(this),
      animation: new Animation(),
    });

    const player = new Entity<AddonsType, PlayerTraits, EventsType>(
      new Sprite(resources['whiteBox'].texture),
      {
        followMouse: new FollowMouse(10),
        borderLimit: new BorderLimit(),
      }
    );

    player.width = 32;
    player.height = 32;
    player.velocity = [300, 0];

    const ground = new Tilemap<AddonsType, EventsType>([1, 1, 1], 3);
    ground.fill(() => new Sprite(resources['whiteBox'].texture));

    this.addChild(ground, player);
    this.addon.entities.addChild(player);
    this.addon.animation.animate();
  }
}
