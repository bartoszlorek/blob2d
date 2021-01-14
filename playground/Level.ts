import {Sprite, IResourceDictionary} from 'pixi.js';
import {Entity, Scene, Tilemap, Addons} from '../src';
import {AddonsType, EventsType, PlayerTraits} from './types';
import {Animation, Entities} from './addons';
import {BorderLimit, FollowMouse} from './traits';

// prettier-ignore
const groundMap = [
  1, 1, 1, 1, 1,
  0, 0, 0, 0, 1,
  0, 0, 0, 0, 1,
  1, 0, 0, 0, 0,
  1, 0, 0, 0, 0,
  1, 1, 1, 1, 1
];

export class Level extends Scene<AddonsType, EventsType> {
  constructor(resources: IResourceDictionary) {
    super();

    this.registerAddons({
      animation: new Animation(),
      collisions: new Addons.Collisions(),
      entities: new Entities(this),
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

    const ground = new Tilemap<AddonsType, EventsType>(groundMap, 5);
    ground.fill(() => new Sprite(resources['whiteBox'].texture));
    ground.x = 100;
    ground.y = 200;

    // todo: handle update position internally
    ground.updateDisplayPosition();

    this.addChild(ground, player);
    this.addon.animation.animate();
    this.addon.collisions.add(player, ground);
    this.addon.entities.addChild(player);
  }
}
