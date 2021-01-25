import {Entity} from '../Entity';
import {Vector2Type} from '../types';

// pre-allocated data
const _vector2: Vector2Type = [0, 0];

// http://noonat.github.io/intersect/#aabb-vs-aabb
// https://gamedev.stackexchange.com/questions/54371/collision-detection-logic/54442
export function getEntitySeparation<
  AddonsType extends {},
  TraitsType extends {},
  EventsType extends string
>(
  entityA: Entity<AddonsType, TraitsType, EventsType>,
  entityB: Entity<AddonsType, TraitsType, EventsType>,
  deltaTime: number
): Vector2Type {
  const halfWidthA = entityA.width / 2;
  const halfHeightA = entityA.height / 2;
  const halfWidthB = entityB.width / 2;
  const halfHeightB = entityB.height / 2;

  const distanceX = entityB.left + halfWidthB - (entityA.left + halfWidthA);
  const distanceY = entityB.top + halfHeightB - (entityA.top + halfHeightA);
  const overlapX = halfWidthA + halfWidthB - Math.abs(distanceX);
  const overlapY = halfHeightA + halfHeightB - Math.abs(distanceY);

  _vector2[0] = 0;
  _vector2[1] = 0;

  if (overlapY <= overlapX) {
    if (distanceY < 0) {
      _vector2[1] = overlapY;
    } else if (distanceY > 0) {
      _vector2[1] = -overlapY;
    }
  } else {
    if (distanceX < 0) {
      _vector2[0] = overlapX;
    } else if (distanceX > 0) {
      _vector2[0] = -overlapX;
    }
  }

  return _vector2;
}