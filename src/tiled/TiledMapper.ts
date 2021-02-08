import {
  ITiledMapJSON,
  ITiledFiniteTileLayer,
  ITiledInfiniteTileLayer,
} from './TiledTypes';

type ITiledLayer = ITiledFiniteTileLayer | ITiledInfiniteTileLayer;

type SpritesIteratee<T> = (tileGID: number, x: number, y: number) => T;

type TilesIteratee<T> = (
  tileGIDs: number[],
  columns: number,
  x: number,
  y: number
) => T;

export class TiledMapper {
  public readonly tileSize: number;

  protected layers: Map<string, ITiledLayer>;

  constructor(map: ITiledMapJSON) {
    this.layers = new Map();
    this.tileSize = map.tilewidth;

    for (let i = 0; i < map.layers.length; i++) {
      const layer = map.layers[i];

      if (layer.type === 'tilelayer') {
        this.layers.set(layer.name, layer);
      }
    }
  }

  public querySprite<T>(name: string, iteratee: SpritesIteratee<T>): T {
    const [result] = this.queryAllSprites<T>(name, iteratee, true);

    if (result === undefined) {
      throw new Error(`No sprite named "${name}" was found.`);
    }

    return result;
  }

  public queryAllSprites<T>(
    name: string,
    iteratee: SpritesIteratee<T>,
    first?: boolean
  ): T[] {
    const layer = this.layers.get(name);
    const results: T[] = [];

    if (layer === undefined) {
      return results;
    }

    // infinite map
    if (layer.chunks !== undefined) {
      for (let j = 0; j < layer.chunks.length; j++) {
        const chunk = layer.chunks[j];

        for (let index = 0; index < chunk.data.length; index++) {
          const tileGID = chunk.data[index];

          if (tileGID > 0) {
            const col = (index % chunk.width) + chunk.x;
            const row = Math.floor(index / chunk.width) + chunk.y;

            results.push(
              iteratee(tileGID, col * this.tileSize, row * this.tileSize)
            );

            if (first && results.length > 0) {
              return results;
            }
          }
        }
      }
    } else if (layer.data !== undefined) {
      for (let index = 0; index < layer.data.length; index++) {
        const tileGID = layer.data[index];

        if (tileGID > 0) {
          const col = (index % layer.width) + layer.x;
          const row = Math.floor(index / layer.width) + layer.y;

          results.push(
            iteratee(tileGID, col * this.tileSize, row * this.tileSize)
          );

          if (first && results.length > 0) {
            return results;
          }
        }
      }
    }

    return results;
  }

  public queryAllTiles<T>(name: string, iteratee: TilesIteratee<T>): T[] {
    const layer = this.layers.get(name);
    const results: T[] = [];

    if (layer === undefined) {
      return results;
    }

    // infinite map
    if (layer.chunks !== undefined) {
      for (let j = 0; j < layer.chunks.length; j++) {
        const chunk = layer.chunks[j];

        results.push(
          iteratee(
            chunk.data,
            chunk.width,
            chunk.x * this.tileSize,
            chunk.y * this.tileSize
          )
        );
      }
    } else if (layer.data !== undefined) {
      results.push(
        iteratee(
          layer.data,
          layer.width,
          layer.x * this.tileSize,
          layer.y * this.tileSize
        )
      );
    }

    return results;
  }
}
