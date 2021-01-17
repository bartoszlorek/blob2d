import {BoundingBox} from '../BoundingBox';
import {Entity} from '../Entity';
import {Tilemap} from '../Tilemap';
import {Vector2Type, Vector3Type} from '../types';

// pre-allocated data
const _clone = new BoundingBox();
const _vector2: Vector2Type = [0, 0];
const _vector3: Vector3Type = [0, 0, 0];

export function getTileSeparation<
  AddonsType extends {},
  TraitsType extends {},
  EventsType extends string
>(
  tilemap: Tilemap<AddonsType, EventsType>,
  entity: Entity<AddonsType, TraitsType, EventsType>,
  deltaTime: number
): Vector3Type {
  _clone.copy(entity);
  _vector3[0] = entity.velocity[0];
  _vector3[1] = entity.velocity[1];
  _vector3[2] = 0; //  no collision detected

  // position multiplied by deltaTime will give a shift in px
  const velocityX = _vector3[0] * deltaTime;
  const velocityY = _vector3[1] * deltaTime;

  // to prevent "wall sliding" issue, collision detection requires
  // perform the x move and the y move as separate steps
  const separationX = getSeparationComponent(0, velocityX, tilemap, _clone);
  _clone.translateX(separationX ?? velocityX);

  // correct position of cloned bbox is not needed after y step
  const separationY = getSeparationComponent(1, velocityY, tilemap, _clone);

  if (separationX !== null) {
    _vector3[0] = separationX / deltaTime;
    _vector3[2] = 1;
  }

  if (separationY !== null) {
    _vector3[1] = separationY / deltaTime;
    _vector3[2] = 1;
  }

  return _vector3;
}

// https://jonathanwhiting.com/tutorial/collision/
// https://github.com/chrisdickinson/collide-2d-tilemap
function getSeparationComponent<
  AddonsType extends {},
  EventsType extends string
>(
  mainAxis: number,
  mainAxisVelocity: number,
  tilemap: Tilemap<AddonsType, EventsType>,
  bbox: BoundingBox
): number | null {
  const {tilesize} = tilemap;
  const positive = mainAxisVelocity > 0;
  const dir = positive ? 1 : -1;

  // offsets align bbox and tilemap to [0,0] position to start indexing from 0
  const mainOffset = tilemap.min[mainAxis];
  const leadingEdge = bbox[positive ? 'max' : 'min'][mainAxis] - mainOffset;
  const mainStart = Math.floor(leadingEdge / tilesize);
  const mainEnd = Math.floor((leadingEdge + mainAxisVelocity) / tilesize) + dir;

  // other axis opposite to the main one
  const sideAxis = +!mainAxis;
  const sideOffset = tilemap.min[sideAxis];
  const sideStart = Math.floor((bbox.min[sideAxis] - sideOffset) / tilesize);
  const sideEnd = Math.ceil((bbox.max[sideAxis] - sideOffset) / tilesize);

  const mainMax = (tilemap.max[mainAxis] - tilemap.min[mainAxis]) / tilesize;
  const sideMax = (tilemap.max[sideAxis] - tilemap.min[sideAxis]) / tilesize;

  for (let i = mainStart; i !== mainEnd; i += dir) {
    if (i < 0 || i >= mainMax) continue;

    for (let j = sideStart; j !== sideEnd; j++) {
      if (j < 0 || j >= sideMax) continue;

      _vector2[mainAxis] = i;
      _vector2[sideAxis] = j;

      const index = tilemap.getIndex.apply(tilemap, _vector2);
      const value = tilemap.values[index];

      if (value > 0) {
        const tileEdge = (positive ? i : i + 1) * tilesize;
        return tileEdge - leadingEdge;
      }
    }
  }

  return null;
}
