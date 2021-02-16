import {Entity, TiledSpriteSheet} from 'blob2d';
import {Sprite} from 'pixi.js';
import {CustomTrait} from '../traits';
import {Addons, Events, PlayerTraits} from '../types';

export function makePlayer(spritesheet: TiledSpriteSheet) {
  return (tileGID: number, x: number, y: number) => {
    const traits = {
      customTrait: new CustomTrait(),
    };

    const player = new Entity<Addons, PlayerTraits, Events>(
      new Sprite(spritesheet.getTexture(tileGID)),
      traits
    );

    player.x = x;
    player.y = y;
    player.width = 32;
    player.height = 32;
    player.name = 'player';
    return player;
  };
}
