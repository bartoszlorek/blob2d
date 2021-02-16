import {Entity, ICamera, TiledSpriteSheet} from 'blob2d';
import {Sprite} from 'pixi.js';
import {FollowMouse} from '../traits';
import {Addons, Events, PlayerTraits} from '../types';

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
