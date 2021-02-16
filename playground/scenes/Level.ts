import {Container, IResourceDictionary} from 'pixi.js';
import {
  Animation,
  BoundingBox,
  Camera,
  Collisions,
  Entities,
  Scene,
  ITiledMapJSON,
  TiledMapper,
  TiledSpriteSheet,
} from 'blob2d';

import {tilesets} from '../assets';
import {keyframes} from '../keyframes';
import {makePlatform, makePlayer, makeTiles} from '../layers';
import {Addons, Events} from '../types';

export class Level extends Scene<Addons, Events> {
  constructor(map: ITiledMapJSON, resources: IResourceDictionary) {
    super(Container);

    const spritesheet = new TiledSpriteSheet(map, tilesets, resources);
    const camera = new Camera(this);

    this.registerAddons({
      camera,
      animation: new Animation(this, spritesheet, keyframes),
      collisions: new Collisions(this),
      entities: new Entities(this),
    });

    const mapper = new TiledMapper(map);
    const player = mapper.querySprite(
      'player',
      makePlayer(spritesheet, camera)
    );
    const platform = mapper.querySprite('platform', makePlatform(spritesheet));
    const ground = mapper.queryAllTiles('ground', makeTiles(spritesheet));
    const boxes = mapper.queryAllTiles('boxes', makeTiles(spritesheet));
    const front = mapper.queryAllTiles('front', makeTiles(spritesheet));

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
