import {TVector2} from '../../_types';
import {BoundingBox} from '../../BoundingBox';
import {Entity} from '../../Entity';
import {Tilemap} from '../../Tilemap';

import {getTilemapSeparation} from './TilemapSeparation';
import {TCollisionStaticResponse} from './types';

// pre-allocated data
const _clone = new BoundingBox();

export function detectTilemapCollision<A, T, E extends string>(
  entity: Entity<A, T, E>,
  tilemap: Tilemap<A, E>,
  deltaTime: number,
  response: TCollisionStaticResponse<Entity<A, T, E>, Tilemap<A, E>>
) {
  _clone.copy(entity);
  _clone.translateX(entity.velocity[0] * deltaTime);
  _clone.translateY(entity.velocity[1] * deltaTime);

  if (_clone.intersects(tilemap.tileBounds)) {
    const separation = getTilemapSeparation(tilemap, entity, deltaTime);

    if (separation) {
      response(entity, tilemap, separation);
    }
  }
}
