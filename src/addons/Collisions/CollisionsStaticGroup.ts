import {TAnyEntity, TAnyTilemap} from '../../types';
import {arrayRemove} from '../../utils/array';
import {detectTilemapCollision} from './TilemapCollisions';
import {ICollisionsGroup, TCollisionStaticResponse} from './types';

export class CollisionsStaticGroup<A extends TAnyEntity, B extends TAnyTilemap>
  implements ICollisionsGroup<A | B> {
  public readonly type = 'static';
  public readonly entities: A[];
  public readonly tilemaps: B[];

  protected response: TCollisionStaticResponse<A, B>;

  constructor(
    entities: A[],
    tilemaps: B[],
    response: TCollisionStaticResponse<A, B>
  ) {
    this.entities = [...entities];
    this.tilemaps = [...tilemaps];
    this.response = response;
  }

  resolve(deltaTime: number): void {
    const {entities, tilemaps, response} = this;

    if (entities.length > 1) {
      for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];

        // bypass loop for one element
        if (tilemaps.length > 1) {
          for (let j = 0; j < tilemaps.length; j++) {
            detectTilemapCollision(entity, tilemaps[j], deltaTime, response);
          }
        } else {
          detectTilemapCollision(entity, tilemaps[0], deltaTime, response);
        }
      }
    } else {
      // a single entity collision
      const entity = entities[0];

      // bypass loop for one element
      if (tilemaps.length > 1) {
        for (let j = 0; j < tilemaps.length; j++) {
          detectTilemapCollision(entity, tilemaps[j], deltaTime, response);
        }
      } else {
        detectTilemapCollision(entity, tilemaps[0], deltaTime, response);
      }
    }
  }

  removeChild(child: A | B): boolean {
    const subgroup = child.type === 'entity' ? this.entities : this.tilemaps;
    return arrayRemove(subgroup, child);
  }

  validate(): void {
    if (this.entities.length < 1 || this.tilemaps.length < 1) {
      throw new Error(
        'A static collisions group requires at least one entity and tilemap.'
      );
    }
  }

  destroy(): void {
    this.entities.length = 0;
    this.tilemaps.length = 0;
  }
}
