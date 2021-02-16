import {Entity, TiledSpriteSheet} from 'blob2d';
import {Sprite} from 'pixi.js';
import {WaveMovement} from '../traits';
import {Addons, Events, PlatformTraits} from '../types';

export function makePlatform(spritesheet: TiledSpriteSheet) {
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
