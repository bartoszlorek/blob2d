import {
  ITiledMapJSON,
  ITiledFiniteTileLayer,
  ITiledInfiniteTileLayer,
} from './TiledTypes';

type SpritesIteratee<T> = (tileGID: number, x: number, y: number) => T;
type TilesIteratee<T> = (
  tileGIDs: number[],
  columns: number,
  x: number,
  y: number
) => T;

export class TiledMapper {
  public readonly tilesize: number;

  protected layers: Map<
    string,
    ITiledFiniteTileLayer | ITiledInfiniteTileLayer
  >;

  constructor(map: ITiledMapJSON) {
    this.layers = new Map();
    this.tilesize = map.tilewidth;

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
            const x = (index % chunk.width) + chunk.x;
            const y = Math.floor(index / chunk.width) + chunk.y;

            results.push(
              iteratee(tileGID, x * this.tilesize, y * this.tilesize)
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
          const x = (index % layer.width) + layer.x;
          const y = Math.floor(index / layer.width) + layer.y;

          results.push(iteratee(tileGID, x * this.tilesize, y * this.tilesize));

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
            chunk.x * this.tilesize,
            chunk.y * this.tilesize
          )
        );
      }
    } else if (layer.data !== undefined) {
      results.push(
        iteratee(
          layer.data,
          layer.width,
          layer.x * this.tilesize,
          layer.y * this.tilesize
        )
      );
    }

    return results;
  }
}
