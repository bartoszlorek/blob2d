import {ISpriteSheet} from '../_types';
import {BaseTexture, Texture, Rectangle, IResourceDictionary} from 'pixi.js';
import {ITiledMapJSON, ITiledTilesetDictionary} from './TiledTypes';

interface SourceTileset {
  readonly baseTexture: BaseTexture;
  readonly columns: number;
  readonly tilesize: number;
  readonly firstGID: number;
  readonly lastGID: number;
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

    // format all tilesets of the given map to sources
    this.sourceTilesets = map.tilesets.map((tileset, index, sets) => {
      const name = tileset.source.replace('.json', '');
      const nextTileset = sets[index + 1];

      if (tilesets[name] === undefined) {
        throw new Error(`"${name}" is not defined tileset.`);
      }

      if (resources[name] === undefined) {
        throw new Error(`"${name}" is not defined asset of tileset.`);
      }

      return {
        baseTexture: resources[name].texture.baseTexture,
        columns: tilesets[name].columns,
        tilesize: tilesets[name].tilewidth,
        firstGID: tileset.firstgid,
        lastGID: nextTileset ? nextTileset.firstgid - 1 : Infinity,
      };
    });
  }

  public getTextureByGID(tileGID: number): Texture {
    if (this.cachedTextures.has(tileGID)) {
      return this.cachedTextures.get(tileGID) as Texture;
    }

    for (let i = 0; i < this.sourceTilesets.length; i++) {
      const tileset = this.sourceTilesets[i];

      if (tileset.firstGID <= tileGID && tileset.lastGID >= tileGID) {
        return this.getTexture(tileGID, tileset);
      }
    }

    throw new Error(`missing texture with GID:${tileGID}`);
  }

  protected getTexture(tileGID: number, tileset: SourceTileset): Texture {
    const {baseTexture, columns, tilesize, firstGID} = tileset;

    const index = tileGID - firstGID;
    const x = index % columns;
    const y = Math.floor(index / columns);

    const rect = new Rectangle(x * tilesize, y * tilesize, tilesize, tilesize);
    const texture = new Texture(baseTexture, rect);
    this.cachedTextures.set(tileGID, texture);

    return texture;
  }

  public destroy() {
    this.cachedTextures.clear();
    this.sourceTilesets.length = 0;
  }
}
