import {TVector2} from '../_types';
import {BoundingBox} from '../BoundingBox';
import {Entity} from '../Entity';
import {Tilemap} from '../Tilemap';

import {getEntitySeparation} from './CollisionsSeparateEntity';
import {getTileSeparation} from './CollisionsSeparateTilemap';
import {TSeparation} from './CollisionsTypes';

// pre-allocated data
const _cloneA = new BoundingBox();
const _cloneB = new BoundingBox();

export function collideEntity<A, T, E extends string>(
  entityA: Entity<A, T, E>,
  entityB: Entity<A, T, E>,
  deltaTime: number,
  response: (
    entity: Entity<A, T, E>,
    tilemap: Entity<A, T, E>,
    separation: TSeparation<number>
  ) => void
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

export function collideTile<A, T, E extends string>(
  entity: Entity<A, T, E>,
  tilemap: Tilemap<A, E>,
  deltaTime: number,
  response: (
    entity: Entity<A, T, E>,
    tilemap: Tilemap<A, E>,
    separation: TSeparation<TVector2>
  ) => void
) {
  _cloneA.copy(entity);
  _cloneA.translateX(entity.velocity[0] * deltaTime);
  _cloneA.translateY(entity.velocity[1] * deltaTime);

  if (_cloneA.intersects(tilemap.tileBounds)) {
    const separation = getTileSeparation(tilemap, entity, deltaTime);

    if (separation) {
      response(entity, tilemap, separation);
    }
  }
}
