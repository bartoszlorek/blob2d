import {Container, IResourceDictionary} from 'pixi.js';
import {
  Animation,
  Entities,
  Scene,
  ITiledMapJSON,
  TiledMapper,
  TiledSpriteSheet,
  TKeyframesDictionary,
} from 'blob2d';

import {CustomAddon} from '../addons';
import {tilesets} from '../assets';
import {Addons, Events, Keyframes} from '../types';
import {makePlayer} from '../layers';

const keyframes: TKeyframesDictionary<Keyframes> = {
  // ...
};

export class Level extends Scene<Addons, Events> {
  constructor(map: ITiledMapJSON, resources: IResourceDictionary) {
    super(Container);

    const spritesheet = new TiledSpriteSheet(map, tilesets, resources);

    this.registerAddons({
      animation: new Animation(this, spritesheet, keyframes),
      entities: new Entities(this),
      customAddon: new CustomAddon(),
    });

    const mapper = new TiledMapper(map);
    const player = mapper.querySprite('player', makePlayer(spritesheet));

    this.addElement(player);
    this.addons.entities.addChild(player);
  }
}
