import {TAnyEntity} from '../../types';
import {arrayRemove} from '../../utils/array';
import {detectEntityCollision} from './entityCollisions';
import {ICollisionsGroup, TCollisionDynamicResponse} from './types';

export class CollisionsSelfDynamicGroup<A extends TAnyEntity>
  implements ICollisionsGroup<A> {
  public readonly type = 'self_dynamic';
  public readonly entities: A[];

  protected response: TCollisionDynamicResponse<A, A>;

  constructor(entities: A[], response: TCollisionDynamicResponse<A, A>) {
    this.entities = [...entities];
    this.response = response;
  }

  resolve(deltaTime: number): void {
    for (let i = 0; i < this.entities.length; i++) {
      for (let j = i + 1; j < this.entities.length; j++) {
        detectEntityCollision(
          this.entities[i],
          this.entities[j],
          deltaTime,
          this.response
        );
      }
    }
  }

  removeChild(child: A): boolean {
    return arrayRemove(this.entities, child);
  }

  validate(): void {
    if (this.entities.length < 2) {
      throw new Error(
        'A self dynamic collisions group requires at least two entities.'
      );
    }
  }

  destroy(): void {
    this.entities.length = 0;
  }
}
