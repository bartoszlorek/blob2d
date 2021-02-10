import {BoundingBox} from '../../BoundingBox';
import {ISeparation} from './types';

// pre-allocated data
const _separation: ISeparation<number> = {
  magnitude: 0,
  normal: [0, 0],
};

// http://noonat.github.io/intersect/#aabb-vs-aabb
// https://gamedev.stackexchange.com/questions/54371/collision-detection-logic/54442
export function getEntitySeparation(
  bboxA: BoundingBox,
  bboxB: BoundingBox,
  deltaTime: number
): ISeparation<number> {
  const halfSizeXA = bboxA.width / 2;
  const halfSizeYA = bboxA.height / 2;
  const halfSizeXB = bboxB.width / 2;
  const halfSizeYB = bboxB.height / 2;

  const distanceX = bboxB.left + halfSizeXB - (bboxA.left + halfSizeXA);
  const distanceY = bboxB.top + halfSizeYB - (bboxA.top + halfSizeYA);
  const overlapX = halfSizeXA + halfSizeXB - Math.abs(distanceX);
  const overlapY = halfSizeYA + halfSizeYB - Math.abs(distanceY);

  if (overlapY <= overlapX) {
    _separation.magnitude = overlapY / deltaTime;
    _separation.normal[0] = 0; // no effects

    if (distanceY < 0) {
      _separation.normal[1] = 1;
    } else if (distanceY > 0) {
      _separation.normal[1] = -1;
    }
  } else {
    _separation.magnitude = overlapX / deltaTime;
    _separation.normal[1] = 0; // no effects

    if (distanceX < 0) {
      _separation.normal[0] = 1;
    } else if (distanceX > 0) {
      _separation.normal[0] = -1;
    }
  }

  return _separation;
}
