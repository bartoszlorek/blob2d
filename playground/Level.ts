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
import {Addons, Events, PlayerTraits, PlatformTraits, Keyframes} from './types';
import {BorderLimit, FollowMouse, WaveMovement} from './traits';
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

// layers/makePlatform.ts
function makePlatform(spritesheet: TiledSpriteSheet) {
  return (tileGID: number, x: number, y: number) => {
    const platform = new Entity<Addons, PlatformTraits, Events>(
      new Sprite(spritesheet.getTextureByGID(tileGID)),
      {
        waveMovement: new WaveMovement(y, 32),
      }
    );

    platform.x = x;
    platform.y = y;
    platform.width = 32;
    platform.height = 32;
    platform.name = 'platform';
    platform.physics = 'kinematic';
    return platform;
  };
}

// layers/makeSimpleTiles.ts
function makeSimpleTiles(spritesheet: TiledSpriteSheet) {
  return (tileGIDs: number[], columns: number, x: number, y: number) => {
    const map = new Tilemap<Addons, Events>(new Container(), tileGIDs, columns);

    map.fill(tileGID => new Sprite(spritesheet.getTextureByGID(tileGID)));
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
    const platform = mapper.querySprite('platform', makePlatform(spritesheet));
    const ground = mapper.queryAllTiles('ground', makeSimpleTiles(spritesheet));
    const boxes = mapper.queryAllTiles('boxes', makeSimpleTiles(spritesheet));
    const front = mapper.queryAllTiles('front', makeSimpleTiles(spritesheet));

    this.addElement(...ground, ...boxes, player, ...front, platform);
    this.addon.entities.addChild(player, platform);
    this.addon.collisions.addStatic(player, ground, cb);
    this.addon.collisions.addDynamic(player, platform, cb);

    this.addon.animation.play('player_move', player.display);
  }
}

function cb() {
  return true;
}
