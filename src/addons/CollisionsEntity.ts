import {BoundingBox} from '../BoundingBox';
import {TSeparation} from './CollisionsTypes';

// pre-allocated data
const _separation: TSeparation<number> = {
  length: 0,
  normal: [0, 0],
};

// http://noonat.github.io/intersect/#aabb-vs-aabb
// https://gamedev.stackexchange.com/questions/54371/collision-detection-logic/54442
export function getEntitySeparation<
  TAddons extends {},
  TTraits extends {},
  TEvents extends string
>(
  entityA: BoundingBox,
  entityB: BoundingBox,
  deltaTime: number
): TSeparation<number> {
  const halfWidthA = entityA.width / 2;
  const halfHeightA = entityA.height / 2;
  const halfWidthB = entityB.width / 2;
  const halfHeightB = entityB.height / 2;

  const distanceX = entityB.left + halfWidthB - (entityA.left + halfWidthA);
  const distanceY = entityB.top + halfHeightB - (entityA.top + halfHeightA);
  const overlapX = halfWidthA + halfWidthB - Math.abs(distanceX);
  const overlapY = halfHeightA + halfHeightB - Math.abs(distanceY);

  if (overlapY <= overlapX) {
    _separation.length = overlapY / deltaTime;
    _separation.normal[0] = 0; // no effects

    if (distanceY < 0) {
      _separation.normal[1] = 1;
    } else if (distanceY > 0) {
      _separation.normal[1] = -1;
    }
  } else {
    _separation.length = overlapX / deltaTime;
    _separation.normal[1] = 0; // no effects

    if (distanceX < 0) {
      _separation.normal[0] = 1;
    } else if (distanceX > 0) {
      _separation.normal[0] = -1;
    }
  }

  return _separation;
}
