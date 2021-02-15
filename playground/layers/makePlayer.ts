import {Sprite} from 'pixi.js';
import {Entity, ICamera, TiledSpriteSheet} from '../../src';
import {Addons, PlayerTraits, Events} from '../types';
import {FollowMouse} from '../traits';

export function makePlayer(spritesheet: TiledSpriteSheet, camera: ICamera) {
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
