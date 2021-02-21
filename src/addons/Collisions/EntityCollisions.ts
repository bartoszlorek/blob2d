import {BoundingBox} from '../../BoundingBox';
import {TAnyEntity} from '../../types';
import {getEntitySeparation} from './entitySeparation';
import {TCollisionDynamicResponse} from './types';

// pre-allocated data
const _cloneA = new BoundingBox();
const _cloneB = new BoundingBox();

export function detectEntityCollision<
  A extends TAnyEntity,
  B extends TAnyEntity
>(
  entityA: A,
  entityB: B,
  deltaTime: number,
  response: TCollisionDynamicResponse<A, B>
) {
  _cloneA.copy(entityA);
  _cloneA.translateX(entityA.velocity[0] * deltaTime);
  _cloneA.translateY(entityA.velocity[1] * deltaTime);

  _cloneB.copy(entityB);
  _cloneB.translateX(entityB.velocity[0] * deltaTime);
  _cloneB.translateY(entityB.velocity[1] * deltaTime);

  if (_cloneA.intersects(_cloneB)) {
    const isDynamicA = entityA.physics === 'dynamic';
    const isDynamicB = entityB.physics === 'dynamic';
    let separation;

    if (isDynamicA > isDynamicB) {
      separation = getEntitySeparation(entityA, _cloneB, deltaTime);
    } else if (isDynamicA < isDynamicB) {
      separation = getEntitySeparation(_cloneA, entityB, deltaTime);
    } else {
      separation = getEntitySeparation(entityA, entityB, deltaTime);
    }

    response(entityA, entityB, separation);
  }
}
