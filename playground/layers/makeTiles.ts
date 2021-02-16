import {Container, Sprite} from 'pixi.js';
import {Tilemap, TiledSpriteSheet} from 'blob2d';
import {Addons, Events} from '../types';

export function makeTiles(spritesheet: TiledSpriteSheet) {
  return (tileGIDs: number[], columns: number, x: number, y: number) => {
    const map = new Tilemap<Addons, Events>(new Container(), tileGIDs, columns);

    map.assign(tileGID => new Sprite(spritesheet.getTexture(tileGID)));
    map.x = x;
    map.y = y;
    return map;
  };
}
