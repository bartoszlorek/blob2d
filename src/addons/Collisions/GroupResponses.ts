import {TCollisionStaticResponse, TCollisionDynamicResponse} from './types';

export const staticResponse: TCollisionStaticResponse = function (
  entity,
  tilemap,
  separation
) {
  const {magnitude, normal} = separation;

  if (normal[0] !== 0) {
    entity.velocity[0] = magnitude[0] * normal[0];
  }
  if (normal[1] !== 0) {
    entity.velocity[1] = magnitude[1] * normal[1];
  }
};

export const dynamicResponse: TCollisionDynamicResponse = function (
  entityA,
  entityB,
  separation
) {
  const {magnitude, normal} = separation;
  const isDynamicA = entityA.physics === 'dynamic';
  const isDynamicB = entityB.physics === 'dynamic';

  if (isDynamicA > isDynamicB) {
    if (normal[0] !== 0) {
      entityA.velocity[0] = magnitude * normal[0];
    } else {
      entityA.velocity[1] = magnitude * normal[1];
    }
  } else if (isDynamicA < isDynamicB) {
    if (normal[0] !== 0) {
      entityB.velocity[0] = magnitude * -normal[0];
    } else {
      entityB.velocity[1] = magnitude * -normal[1];
    }
  } else {
    if (normal[0] !== 0) {
      entityA.velocity[0] = (magnitude / 2) * normal[0];
      entityB.velocity[0] = (magnitude / 2) * -normal[0];
    } else {
      entityA.velocity[1] = (magnitude / 2) * normal[1];
      entityB.velocity[1] = (magnitude / 2) * -normal[1];
    }
  }
};
