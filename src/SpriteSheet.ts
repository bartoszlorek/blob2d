import {Texture, Rectangle} from 'pixi.js';
import type PIXI from 'pixi.js';

interface BaseSpriteSheet {
  baseTexture: PIXI.BaseTexture;
  dimension: number;
  firstId: number;
  lastId: number;
  tilesize: number;
}

export class SpriteSheet {
  protected sheets: BaseSpriteSheet[];
  protected cachedTextures: Map<number, Texture>;

  constructor(sheets: BaseSpriteSheet[]) {
    this.sheets = [...sheets];
    this.cachedTextures = new Map();
  }

  public getTextureById(id: number): Texture | null {
    if (this.cachedTextures.has(id)) {
      return this.cachedTextures.get(id) ?? null;
    }

    for (let i = 0; i < this.sheets.length; i++) {
      const sheet = this.sheets[i];

      if (sheet.firstId <= id && sheet.lastId >= id) {
        return this.getTexture(id, sheet);
      }
    }

    return null;
  }

  protected getTexture(id: number, sheet: BaseSpriteSheet): Texture {
    const {baseTexture, dimension, firstId, tilesize} = sheet;

    const index = id - firstId;
    const x = index % dimension;
    const y = Math.floor(index / dimension);

    const rect = new Rectangle(x * tilesize, y * tilesize, tilesize, tilesize);
    const texture = new Texture(baseTexture, rect);
    this.cachedTextures.set(id, texture);

    return texture;
  }

  destroy() {
    this.sheets.length = 0;
    this.cachedTextures.clear();
  }
}
