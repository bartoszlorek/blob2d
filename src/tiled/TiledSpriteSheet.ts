import {BaseTexture, Texture, Rectangle, IResourceDictionary} from 'pixi.js';
import {ISpriteSheet} from '../types';
import {ITiledMapJSON, ITiledTilesetDictionary} from './types';

interface SourceTileset {
  baseTexture: BaseTexture;
  columns: number;
  tilesize: number;
  firstgid: number;
  lastgid: number;
}

export class TiledSpriteSheet implements ISpriteSheet<Texture> {
  protected cachedTextures: Map<number, Texture>;
  protected sourceTilesets: SourceTileset[];

  constructor(
    map: ITiledMapJSON,
    tilesets: ITiledTilesetDictionary,
    resources: IResourceDictionary
  ) {
    this.cachedTextures = new Map();

    // format all tilesets of a given map to sources
    this.sourceTilesets = map.tilesets.map((tileset, index, sets) => {
      const name = tileset.source.replace('.json', '');
      const nextTileset = sets[index + 1];

      return {
        baseTexture: resources[name].texture.baseTexture,
        columns: tilesets[name].columns,
        tilesize: tilesets[name].tilewidth,
        firstgid: tileset.firstgid,
        lastgid: nextTileset ? nextTileset.firstgid - 1 : Infinity,
      };
    });
  }

  public getTextureById(tilegid: number): Texture | null {
    if (this.cachedTextures.has(tilegid)) {
      return this.cachedTextures.get(tilegid) ?? null;
    }

    for (let i = 0; i < this.sourceTilesets.length; i++) {
      const tileset = this.sourceTilesets[i];

      if (tileset.firstgid <= tilegid && tileset.lastgid >= tilegid) {
        return this.getTexture(tilegid, tileset);
      }
    }

    return null;
  }

  protected getTexture(tilegid: number, tileset: SourceTileset): Texture {
    const {baseTexture, columns, tilesize, firstgid} = tileset;

    const index = tilegid - firstgid;
    const x = index % columns;
    const y = Math.floor(index / columns);

    const rect = new Rectangle(x * tilesize, y * tilesize, tilesize, tilesize);
    const texture = new Texture(baseTexture, rect);
    this.cachedTextures.set(tilegid, texture);

    return texture;
  }

  public destroy(): void {
    this.cachedTextures.clear();
    this.sourceTilesets.length = 0;
  }
}
