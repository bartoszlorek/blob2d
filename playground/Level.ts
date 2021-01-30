import {
  Animation,
  Collisions,
  Entities,
  Entity,
  Scene,
  TiledMapper,
  TiledSpriteSheet,
  Tilemap,
  IKeyframesDictionary,
} from '../src';
import {Sprite, IResourceDictionary, Container} from 'pixi.js';
import {Addons, Events, PlayerTraits, Keyframes} from './types';
import {BorderLimit, FollowMouse} from './traits';
import {tilesets, demo01Map} from './assets';

// layers/makePlayer.ts
function makePlayer(spritesheet: TiledSpriteSheet) {
  return (tileGID: number, x: number, y: number) => {
    const player = new Entity<Addons, PlayerTraits, Events>(
      new Sprite(spritesheet.getTextureByGID(tileGID)),
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

// layers/makeSimpleTiles.ts
function makeSimpleTiles(spritesheet: TiledSpriteSheet) {
  return (tileGIDs: number[], columns: number, x: number, y: number) => {
    const map = new Tilemap<Addons, Events>(new Container(), tileGIDs, columns);

    map.fill((tileGID) => new Sprite(spritesheet.getTextureByGID(tileGID)));
    map.setPosition(x, y);
    return map;
  };
}

const keyframes: IKeyframesDictionary<Keyframes> = {
  player_move: {firstGID: 1, lastGID: 4},
};

export class Level extends Scene<Addons, Events> {
  constructor(resources: IResourceDictionary) {
    super(Container);

    const spritesheet = new TiledSpriteSheet(demo01Map, tilesets, resources);
    this.registerAddons({
      animation: new Animation(this, spritesheet, keyframes),
      collisions: new Collisions(this),
      entities: new Entities(this),
    });

    const mapper = new TiledMapper(demo01Map);
    const player = mapper.querySprite('player', makePlayer(spritesheet));
    const ground = mapper.queryAllTiles('ground', makeSimpleTiles(spritesheet));
    const boxes = mapper.queryAllTiles('boxes', makeSimpleTiles(spritesheet));
    const front = mapper.queryAllTiles('front', makeSimpleTiles(spritesheet));

    this.addChild(...ground, ...boxes, player, ...front);
    this.addon.entities.addChild(player);
    this.addon.collisions.addStatic(player, ground, cb);
    // this.addon.collisions.addDynamic(player, platform, cb);

    this.addon.animation.play('player_move', player.display);
  }
}

function cb() {
  return true;
}
