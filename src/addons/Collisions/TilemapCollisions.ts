import {BoundingBox} from '../../BoundingBox';
import {TAnyEntity, TAnyTilemap} from '../../types';
import {getTilemapSeparation} from './TilemapSeparation';
import {TCollisionStaticResponse} from './types';

// pre-allocated data
const _clone = new BoundingBox();

export function detectTilemapCollision(
  entity: TAnyEntity,
  tilemap: TAnyTilemap,
  deltaTime: number,
  response: TCollisionStaticResponse
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
