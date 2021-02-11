import {
  Animation,
  BoundingBox,
  Camera,
  Collisions,
  Entities,
  Entity,
  Scene,
  TiledMapper,
  TiledSpriteSheet,
  Tilemap,
  TKeyframesDictionary,
  ICamera,
} from '../src';
import {Sprite, IResourceDictionary, Container} from 'pixi.js';
import {Addons, Events, PlayerTraits, PlatformTraits, Keyframes} from './types';
import {FollowMouse, WaveMovement} from './traits';
import {tilesets, demo01Map} from './assets';

const keyframes: TKeyframesDictionary<Keyframes> = {
  player_move: {firstGID: 1, lastGID: 4},
};

export class Level extends Scene<Addons, Events> {
  constructor(resources: IResourceDictionary) {
    super(Container);

    const spritesheet = new TiledSpriteSheet(demo01Map, tilesets, resources);
    const camera = new Camera(this);

    this.registerAddons({
      camera,
      animation: new Animation(this, spritesheet, keyframes),
      collisions: new Collisions(this),
      entities: new Entities(this),
    });

    const mapper = new TiledMapper(demo01Map);
    const player = mapper.querySprite(
      'player',
      makePlayer(spritesheet, camera)
    );
    const platform = mapper.querySprite('platform', makePlatform(spritesheet));
    const ground = mapper.queryAllTiles('ground', makeSimpleTiles(spritesheet));
    const boxes = mapper.queryAllTiles('boxes', makeSimpleTiles(spritesheet));
    const front = mapper.queryAllTiles('front', makeSimpleTiles(spritesheet));

    // addons
    const {entities, collisions, animation} = this.addons;
    entities.addChild(player, platform);
    collisions.addStatic(player, ground, Collisions.staticResponse);
    collisions.addDynamic(player, platform, Collisions.dynamicResponse);
    animation.play('player_move', player.display);

    // renderer
    this.addElement(...ground, ...boxes, player, ...front, platform);

    // merge all grounds into a single bbox to focus on
    const bbox = new BoundingBox();
    bbox.merge(...ground.map(tile => tile.tileBounds));
    camera.focus(bbox);
  }
}

// layers/makePlayer.ts
function makePlayer(spritesheet: TiledSpriteSheet, camera: ICamera) {
  return (tileGID: number, x: number, y: number) => {
    const player = new Entity<Addons, PlayerTraits, Events>(
      new Sprite(spritesheet.getTexture(tileGID)),
      {
        followMouse: new FollowMouse(10, camera),
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
      new Sprite(spritesheet.getTexture(tileGID)),
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

    map.assign(tileGID => new Sprite(spritesheet.getTexture(tileGID)));
    map.x = x;
    map.y = y;
    return map;
  };
}
