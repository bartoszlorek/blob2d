import {Sprite, IResourceDictionary} from 'pixi.js';
import {Entity, Scene, Tilemap, Addons} from '../src';
import {AddonsType, EventsType, PlayerTraits, EnemyTraits} from './types';
import {Animation, Entities} from './addons';
import {BorderLimit, FollowMouse, PatrolMove} from './traits';

// prettier-ignore
const groundMap = [
  1, 1, 1, 1, 1, 0,
  0, 0, 0, 0, 1, 0,
  0, 0, 0, 0, 1, 1,
  1, 0, 0, 0, 0, 0,
  1, 0, 0, 0, 0, 0,
  1, 1, 1, 1, 1, 0
];

// prettier-ignore
const platformMap = [
  1, 1, 1, 1,
  0, 0, 0, 1,
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

    const enemy = new Entity<AddonsType, EnemyTraits, EventsType>(
      new Sprite(resources['whiteBox'].texture),
      {
        patrolMove: new PatrolMove(),
      }
    );
    enemy.width = 32;
    enemy.height = 32;
    enemy.x = 484;
    enemy.y = 200;

    const ground = new Tilemap<AddonsType, EventsType>(groundMap, 6);
    ground.fill(() => new Sprite(resources['whiteBox'].texture));
    ground.x = 100;
    ground.y = 200;

    const platform = new Tilemap<AddonsType, EventsType>(platformMap, 4);
    platform.fill(() => new Sprite(resources['whiteBox'].texture));
    platform.x = 356;
    platform.y = 264;

    // todo: handle update position internally
    ground.updateDisplayPosition();
    platform.updateDisplayPosition();

    this.addChild(ground, platform, player, enemy);
    this.addon.animation.animate();
    this.addon.collisions.add(player, [ground, platform], () => true);
    this.addon.entities.addChild(player, enemy);
  }
}
