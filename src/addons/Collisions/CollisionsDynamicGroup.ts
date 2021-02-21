import {TAnyEntity} from '../../types';
import {arrayRemove} from '../../utils/array';
import {detectEntityCollision} from './EntityCollisions';
import {ICollisionsGroup, TCollisionDynamicResponse} from './types';

export class CollisionsDynamicGroup<A extends TAnyEntity, B extends TAnyEntity>
  implements ICollisionsGroup<A | B> {
  public readonly type = 'dynamic';
  public readonly entitiesA: A[];
  public readonly entitiesB: B[];

  protected response: TCollisionDynamicResponse<A, B>;

  constructor(
    entitiesA: A[],
    entitiesB: B[],
    response: TCollisionDynamicResponse<A, B>
  ) {
    this.entitiesA = [...entitiesA];
    this.entitiesB = [...entitiesB];
    this.response = response;
  }

  resolve(deltaTime: number): void {
    const {entitiesA, entitiesB, response} = this;

    // it is optimized for the first subgroup,
    // which often has only one element
    if (entitiesA.length > 1) {
      for (let i = 0; i < entitiesA.length; i++) {
        const entity = entitiesA[i];

        // bypass loop for one element
        if (entitiesB.length > 1) {
          for (let j = 0; j < entitiesB.length; j++) {
            detectEntityCollision(entity, entitiesB[j], deltaTime, response);
          }
        } else {
          detectEntityCollision(entity, entitiesB[0], deltaTime, response);
        }
      }
    } else {
      // a single entity collision
      const entity = entitiesA[0];

      // bypass loop for one element
      if (entitiesB.length > 1) {
        for (let j = 0; j < entitiesB.length; j++) {
          detectEntityCollision(entity, entitiesB[j], deltaTime, response);
        }
      } else {
        detectEntityCollision(entity, entitiesB[0], deltaTime, response);
      }
    }
  }

  removeChild(child: A | B): boolean {
    return (
      arrayRemove(this.entitiesA, child) || arrayRemove(this.entitiesB, child)
    );
  }

  validate(): void {
    if (this.entitiesA.length < 1 || this.entitiesB.length < 1) {
      throw new Error(
        'A dynamic collisions group requires at least one entity from each sub-group.'
      );
    }
  }

  destroy(): void {
    this.entitiesA.length = 0;
    this.entitiesB.length = 0;
  }
}
