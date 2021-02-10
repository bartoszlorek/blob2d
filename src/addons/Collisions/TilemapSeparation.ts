import {TVector2} from '../../_types';
import {BoundingBox} from '../../BoundingBox';
import {Entity} from '../../Entity';
import {Tilemap} from '../../Tilemap';

import {ISeparation} from './types';

// pre-allocated data
const _bbox = new BoundingBox();
const _vector2: TVector2 = [0, 0];
const _separation: ISeparation<TVector2> = {
  magnitude: [0, 0],
  normal: [0, 0],
};

export function getTilemapSeparation<A, T, E extends string>(
  tilemap: Tilemap<A, E>,
  entity: Entity<A, T, E>,
  deltaTime: number
): ISeparation<TVector2> | null {
  _bbox.copy(entity);

  // position multiplied by deltaTime will give a shift in px
  const velocityX = entity.velocity[0] * deltaTime;
  const velocityY = entity.velocity[1] * deltaTime;

  // to prevent "wall sliding" issue, collision detection requires
  // perform the x move and the y move as separate steps
  const separationX = getSeparationComponent(0, velocityX, tilemap, _bbox);
  _bbox.translateX(separationX ?? velocityX);

  // correct position of cloned bbox is not needed after y step
  const separationY = getSeparationComponent(1, velocityY, tilemap, _bbox);

  // no collision detected on both axis
  if (separationX === null && separationY === null) {
    return null;
  }

  if (separationX !== null) {
    _separation.normal[0] = separationX < 0 ? -1 : 1;
    _separation.magnitude[0] = Math.abs(separationX / deltaTime);
  } else {
    _separation.normal[0] = 0;
    _separation.magnitude[0] = 0;
  }

  if (separationY !== null) {
    _separation.normal[1] = separationY < 0 ? -1 : 1;
    _separation.magnitude[1] = Math.abs(separationY / deltaTime);
  } else {
    _separation.normal[1] = 0;
    _separation.magnitude[1] = 0;
  }

  return _separation;
}

// https://jonathanwhiting.com/tutorial/collision/
// https://github.com/chrisdickinson/collide-2d-tilemap
function getSeparationComponent<A, E extends string>(
  mainAxis: number,
  mainAxisVelocity: number,
  tilemap: Tilemap<A, E>,
  bbox: BoundingBox
): number | null {
  const {tileSize} = tilemap;
  const positive = mainAxisVelocity > 0;
  const dir = positive ? 1 : -1;

  // offsets align bbox and tilemap to [0,0] position to start indexing from 0
  const mainOffset = tilemap.min[mainAxis];
  const leadingEdge = bbox[positive ? 'max' : 'min'][mainAxis] - mainOffset;
  const mainStart = Math.floor(leadingEdge / tileSize);
  const mainEnd = Math.floor((leadingEdge + mainAxisVelocity) / tileSize) + dir;

  // other axis opposite to the main one
  const sideAxis = +!mainAxis;
  const sideOffset = tilemap.min[sideAxis];
  const sideStart = Math.floor((bbox.min[sideAxis] - sideOffset) / tileSize);
  const sideEnd = Math.ceil((bbox.max[sideAxis] - sideOffset) / tileSize);

  const mainMax = (tilemap.max[mainAxis] - tilemap.min[mainAxis]) / tileSize;
  const sideMax = (tilemap.max[sideAxis] - tilemap.min[sideAxis]) / tileSize;

  for (let i = mainStart; i !== mainEnd; i += dir) {
    if (i < 0 || i >= mainMax) continue;

    for (let j = sideStart; j !== sideEnd; j++) {
      if (j < 0 || j >= sideMax) continue;

      _vector2[mainAxis] = i;
      _vector2[sideAxis] = j;

      const index = tilemap.getIndex.apply(tilemap, _vector2);
      const value = tilemap.values[index];

      if (value > 0) {
        const tileEdge = (positive ? i : i + 1) * tileSize;
        return tileEdge - leadingEdge;
      }
    }
  }

  return null;
}
