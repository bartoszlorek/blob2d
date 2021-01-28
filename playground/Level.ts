import {
  Entity,
  Scene,
  Tilemap,
  Addons,
  TiledMapper,
  TiledSpriteSheet,
} from '../src';
import {Sprite, IResourceDictionary, Container} from 'pixi.js';
import {AddonsType, EventsType, PlayerTraits} from './types';
import {Animation, Entities} from './addons';
import {BorderLimit, FollowMouse} from './traits';
import {tilesets, demo01Map} from './assets';

function makePlayer(spritesheet: TiledSpriteSheet) {
  return (tileid: number, x: number, y: number) => {
    const player = new Entity<AddonsType, PlayerTraits, EventsType>(
      new Sprite(spritesheet.getTextureById(tileid)),
      {
        followMouse: new FollowMouse(10),
        borderLimit: new BorderLimit(),
      }
    );

    player.x = x;
    player.y = y;
    player.width = 32;
    player.height = 32;
    player.name = 'player';
    return player;
  };
}

function makeSimpleTiles(spritesheet: TiledSpriteSheet) {
  return (tileids: number[], columns: number, x: number, y: number) => {
    const map = new Tilemap<AddonsType, EventsType>(
      new Container(),
      tileids,
      columns
    );

    map.fill((tileid) => new Sprite(spritesheet.getTextureById(tileid)));
    map.setPosition(x, y);
    return map;
  };
}

export class Level extends Scene<AddonsType, EventsType> {
  constructor(resources: IResourceDictionary) {
    super(Container);

    this.registerAddons({
      animation: new Animation(),
      collisions: new Addons.Collisions(this),
      entities: new Entities(this),
    });

    const spritesheet = new TiledSpriteSheet(demo01Map, tilesets, resources);
    const mapper = new TiledMapper(demo01Map);

    const player = mapper.querySprite('player', makePlayer(spritesheet));
    const ground = mapper.queryAllTiles('ground', makeSimpleTiles(spritesheet));
    const boxes = mapper.queryAllTiles('boxes', makeSimpleTiles(spritesheet));
    const front = mapper.queryAllTiles('front', makeSimpleTiles(spritesheet));

    this.addChild(...ground, ...boxes, player, ...front);
    this.addon.animation.animate();
    this.addon.entities.addChild(player);
    this.addon.collisions.addStatic(player, ground, cb);
    // this.addon.collisions.addDynamic(player, enemy, cb);
  }
}

function cb() {
  return true;
}
