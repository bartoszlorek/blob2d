import {TiledMapJson, FiniteTileLayer, InfiniteTileLayer} from './types';

type SpritesIteratee = (tileid: number, x: number, y: number) => void;
type TilesIteratee = (tileids: number[], x: number, y: number) => void;

export class TiledMapper {
  protected layers: Map<string, FiniteTileLayer | InfiniteTileLayer>;

  constructor(map: TiledMapJson) {
    this.layers = new Map();

    for (let i = 0; i < map.layers.length; i++) {
      const layer = map.layers[i];

      if (layer.type === 'tilelayer') {
        this.layers.set(layer.name, layer);
      }
    }
  }

  public queryAllSprites(name: string, iteratee: SpritesIteratee): void {
    const layer = this.layers.get(name);

    if (layer === undefined) {
      return;
    }

    // infinite map
    if (layer.chunks !== undefined) {
      for (let j = 0; j < layer.chunks.length; j++) {
        const chunk = layer.chunks[j];

        for (let index = 0; index < chunk.data.length; index++) {
          const tileid = chunk.data[index];

          if (tileid > 0) {
            const x = (index % chunk.width) + chunk.x;
            const y = Math.floor(index / chunk.width) + chunk.y;
            iteratee(tileid, x, y);
          }
        }
      }
    } else if (layer.data !== undefined) {
      for (let index = 0; index < layer.data.length; index++) {
        const tileid = layer.data[index];

        if (tileid > 0) {
          const x = (index % layer.width) + layer.x;
          const y = Math.floor(index / layer.width) + layer.y;
          iteratee(tileid, x, y);
        }
      }
    }
  }

  public queryAllTiles(name: string, iteratee: TilesIteratee): void {
    const layer = this.layers.get(name);

    if (layer === undefined) {
      return;
    }

    // infinite map
    if (layer.chunks !== undefined) {
      for (let j = 0; j < layer.chunks.length; j++) {
        const chunk = layer.chunks[j];
        iteratee(chunk.data, chunk.x, chunk.y);
      }
    } else if (layer.data !== undefined) {
      iteratee(layer.data, layer.x, layer.y);
    }
  }
}
