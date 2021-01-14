import {BoundingBox} from '../BoundingBox';
import {Entity} from '../Entity';
import {Tilemap} from '../Tilemap';
import {VectorType} from '../types';

// pre-allocated data
const _clone = new BoundingBox();
const _vector: VectorType = [0, 0];

export function getTileSeparation<
  AddonsType extends {},
  TraitsType extends {},
  EventsType extends string
>(
  tilemap: Tilemap<AddonsType, EventsType>,
  entity: Entity<AddonsType, TraitsType, EventsType>,
  deltaTime: number
): VectorType {
  // make a clone to not mutate the original entity
  _clone.copy(entity);

  // the position multiplied by deltaTime will give a shift in px
  let velocityX = entity.velocity[0] * deltaTime;
  let velocityY = entity.velocity[1] * deltaTime;

  // the collision detection requires two steps separation: x and y
  velocityX = getSeparationComponent(0, velocityX, tilemap, _clone);
  _clone.translateX(velocityX);

  // the position of cloned bbox is not needed after finding y separation
  velocityY = getSeparationComponent(1, velocityY, tilemap, _clone);

  _vector[0] = velocityX / deltaTime;
  _vector[1] = velocityY / deltaTime;
  return _vector;
}

// https://jonathanwhiting.com/tutorial/collision/
// https://github.com/chrisdickinson/collide-2d-tilemap
function getSeparationComponent<
  AddonsType extends {},
  EventsType extends string
>(
  axis: number,
  axisVelocity: number,
  tilemap: Tilemap<AddonsType, EventsType>,
  bbox: BoundingBox
): number {
  const {tilesize} = tilemap;
  const positive = axisVelocity > 0;
  const dir = positive ? 1 : -1;

  // offsets align bbox and tilemap to [0,0] position to start indexing from 0
  const mainOffset = tilemap.min[axis];
  const leadingEdge = bbox[positive ? 'max' : 'min'][axis] - mainOffset;
  const mainStart = Math.floor(leadingEdge / tilesize);
  const mainEnd = Math.floor((leadingEdge + axisVelocity) / tilesize) + dir;

  // other axis opposite to the main one
  const sideAxis = +!axis;
  const sideOffset = tilemap.min[sideAxis];
  const sideStart = Math.floor((bbox.min[sideAxis] - sideOffset) / tilesize);
  const sideEnd = Math.ceil((bbox.max[sideAxis] - sideOffset) / tilesize);

  const mainMax = (tilemap.max[axis] - tilemap.min[axis]) / tilesize;
  const sideMax = (tilemap.max[sideAxis] - tilemap.min[sideAxis]) / tilesize;

  for (let i = mainStart; i !== mainEnd; i += dir) {
    if (i < 0 || i >= mainMax) continue;

    for (let j = sideStart; j !== sideEnd; j++) {
      if (j < 0 || j >= sideMax) continue;

      _vector[axis] = i;
      _vector[sideAxis] = j;

      const index = tilemap.getIndex.apply(tilemap, _vector);
      const value = tilemap.values[index];

      if (value > 0) {
        const tileEdge = (positive ? i : i + 1) * tilesize;
        return tileEdge - leadingEdge;
      }
    }
  }

  return axisVelocity;
}
