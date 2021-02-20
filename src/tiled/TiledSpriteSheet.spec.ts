import {BaseTexture, Texture} from 'pixi.js';
import {IResourceDictionary} from '../types';
import {TiledSpriteSheet} from './TiledSpriteSheet';
import {maps, tilesets} from './_mocks';

class TestTiledSpriteSheet extends TiledSpriteSheet<
  IResourceDictionary<Texture>
> {
  getSourceTilesets() {
    return this.sourceTilesets;
  }
}

const {finite_map} = maps;
const baseTexture01 = new BaseTexture('sprites_01.png');
const baseTexture02 = new BaseTexture('sprites_02.png');
const resources: IResourceDictionary<Texture> = {
  sprites_01: {texture: new Texture(baseTexture01)},
  sprites_02: {texture: new Texture(baseTexture02)},
};

describe('class TiledSpriteSheet', () => {
  it('creates source tilesets from a given map', () => {
    const mapper = new TestTiledSpriteSheet(finite_map, tilesets, resources);

    expect(mapper.getSourceTilesets()).toEqual([
      {
        baseTexture: baseTexture01,
        columns: 4,
        tileSize: 32,
        firstGID: 1,
        lastGID: 16,
      },
      {
        baseTexture: baseTexture02,
        columns: 4,
        tileSize: 32,
        firstGID: 17,
        lastGID: 32,
      },
    ]);
  });

  it('throws an error when looking tileset is not defined', () => {
    expect(() => {
      new TestTiledSpriteSheet(finite_map, {}, resources);
    }).toThrowError('The "sprites_01" is not defined tileset.');
  });

  it('throws an error when looking resource is not loaded', () => {
    expect(() => {
      new TestTiledSpriteSheet(finite_map, tilesets, {});
    }).toThrowError('The "sprites_01" is not loaded resource.');
  });

  it('returns a new texture for a given tileGID from the first tileset', () => {
    const mapper = new TestTiledSpriteSheet(finite_map, tilesets, resources);
    const texture = mapper.getTexture(4);

    expect(texture).toMatchObject({
      baseTexture: baseTexture01,
      orig: {
        width: 32,
        height: 32,
        x: 96,
        y: 0,
      },
    });
  });

  it('returns a new texture for a given tileGID from the second tileset', () => {
    const mapper = new TestTiledSpriteSheet(finite_map, tilesets, resources);
    const texture = mapper.getTexture(22);

    expect(texture).toMatchObject({
      baseTexture: baseTexture02,
      orig: {
        width: 32,
        height: 32,
        x: 32,
        y: 32,
      },
    });
  });

  it('throws an error when cannot find texture for a given tileGID', () => {
    const mapper = new TestTiledSpriteSheet(finite_map, tilesets, resources);

    expect(() => {
      mapper.getTexture(100);
    }).toThrowError('missing texture with tileGID:100');
  });

  it('returns cached texture for the same tileGID', () => {
    const mapper = new TestTiledSpriteSheet(finite_map, tilesets, resources);
    const texture1 = mapper.getTexture(4);
    const texture2 = mapper.getTexture(4);

    expect(texture1).toBe(texture2);
  });
});
