import {
  ICollisionStaticGroup,
  ICollisionDynamicGroup,
  ICollisionSelfDynamicGroup,
} from './CollisionsTypes';
import {collideEntity, collideTile} from './CollisionsColliders';

export function resolveStaticGroup<A, T, E extends string>(
  group: ICollisionStaticGroup<A, T, E>,
  deltaTime: number
) {
  const {entities, tilemaps, response} = group;

  if (entities.length > 1) {
    for (let i = 0; i < entities.length; i++) {
      const entity = entities[i];

      // bypass loop for one element
      if (tilemaps.length > 1) {
        for (let j = 0; j < tilemaps.length; j++) {
          collideTile(entity, tilemaps[j], deltaTime, response);
        }
      } else {
        collideTile(entity, tilemaps[0], deltaTime, response);
      }
    }
  } else {
    // a single entity collision
    const entity = entities[0];

    // bypass loop for one element
    if (tilemaps.length > 1) {
      for (let j = 0; j < tilemaps.length; j++) {
        collideTile(entity, tilemaps[j], deltaTime, response);
      }
    } else {
      collideTile(entity, tilemaps[0], deltaTime, response);
    }
  }
}

export function resolveDynamicGroup<A, T, E extends string>(
  group: ICollisionDynamicGroup<A, T, E>,
  deltaTime: number
) {
  const {entitiesA, entitiesB, response} = group;

  // it is optimized for the first subgroup,
  // which often has only one element
  if (entitiesA.length > 1) {
    for (let i = 0; i < entitiesA.length; i++) {
      const entity = entitiesA[i];

      // bypass loop for one element
      if (entitiesB.length > 1) {
        for (let j = 0; j < entitiesB.length; j++) {
          collideEntity(entity, entitiesB[j], deltaTime, response);
        }
      } else {
        collideEntity(entity, entitiesB[0], deltaTime, response);
      }
    }
  } else {
    // a single entity collision
    const entity = entitiesA[0];

    // bypass loop for one element
    if (entitiesB.length > 1) {
      for (let j = 0; j < entitiesB.length; j++) {
        collideEntity(entity, entitiesB[j], deltaTime, response);
      }
    } else {
      collideEntity(entity, entitiesB[0], deltaTime, response);
    }
  }
}

export function resolveSelfDynamicGroup<A, T, E extends string>(
  group: ICollisionSelfDynamicGroup<A, T, E>,
  deltaTime: number
) {
  const {entities, response} = group;

  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      collideEntity(entities[i], entities[j], deltaTime, response);
    }
  }
}
