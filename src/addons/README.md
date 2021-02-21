# Built-in Addons

Addons provide a way to extend `Scene` with additional functionality, like animation, physics, or updating `Traits`.

## Table of Contents

- [Animation](#animation)
- [Camera](#camera)
- [Collisions](#collisions)
- [Entities](#entities)

## Animation

```ts
const keyframes: TKeyframesDictionary<TKeys> = {
  player_jump: {firstGID: 1, lastGID: 4},
  player_move: {firstGID: 5, lastGID: 10},
};

const animation = new Animation<TAddons, TEvents, TKeys>(
  scene,            // Scene<TAddons, TEvents>,
  spritesheet,      // TiledSpriteSheet,
  keyframes,        // TKeyframesDictionary<TKeys>,
  deltaTimePerFrame // [optional] number = 1/12
);
```

```ts
// public interface
interface Animation
{
  public readonly playing: Map<ISprite, TKeys>;
  public readonly spritesheet: TiledSpriteSheet;
  public readonly keyframes: TKeyframesDictionary<TKeys>;

  // automatically requests the next frame on every update
  public play(name: TKeys, sprite: ISprite): void;

  // pauses requesting the next frame
  public pause(sprite: ISprite): void;

  // called on every game tick and limits animation FPS
  public update(deltaTime: number): void;

  // request only one more frame of animation
  public requestFrame(name: TKeys, sprite: ISprite): void;

  // clears cached data
  public destroy(): void;
}
```

## Camera

Built-in addon positioning the scene foreground on the screen.

```ts
const camera = new Camera<TAddons, TEvents>(
  scene // Scene<TAddons, TEvents>
);
```

```ts
// public interface
interface Camera
{
  public offsetX: number;
  public offsetY: number;

  // positions the given BoundingBox
  // in the center of the screen
  public focus(bbox: BoundingBox): void;

  // applies offset to the foreground
  public update(deltaTime: number): void;

  // cleanup
  public destroy(): void;
}
```

## Collisions

Built-in addon for arcade collision detection. Handles entity-entity and entity-tilemap collisions.

```ts
const collisions = new Collisions<TAddons, TTraits, TEvents>(
  scene // Scene<TAddons, TEvents>
);
```

```ts
// public interface
interface Collisions
{
  // built-in responses to handle collision
  public static staticResponse: TCollisionStaticResponse;
  public static dynamicResponse: TCollisionDynamicResponse;
  public readonly groups: ICollisionsGroup[];

  // adds entity-tilemap or entity-entity collisions group
  public addGroup(group: ICollisionsGroup): ICollisionsGroup;

  // resolves collisions groups at each game tick
  public update(deltaTime: number): void;

  // clears groups data 
  public destroy(): void;
}
```

### **Collisions Group**

Describes the relationships between the elements it contains and provides a way to resolve their collisions.

```ts
CollisionsDynamicGroup
CollisionsSelfDynamicGroup
CollisionsStaticGroup
```

**Hint:** you can add a newly created element to an existing group, pushing it to the subgroup.
```ts
import {CollisionsDynamicGroup} from 'blob2d';

const group = new CollisionsDynamicGroup([player], [], response);
const bullet = new Entity();

group.entitiesB.push(bullet);
```

### **Collision Response**

The function passed to the collision detection method that determines what should happen when two objects collide. It takes three arguments: two colliders and separation object.

```ts
interface ISeparation {
  magnitude: TVector2 | number;
  normal: TVector2;
}
```

**Hint:** Pass a custom function that won't change the velocity of colliding objects if you just want to detect a collision without actually responding to it.

```ts
import {
  TCollisionStaticResponse,
  TCollisionDynamicResponse
} from 'blob2d';

const staticResponse: TCollisionStaticResponse = function (
  entity,    // Entity
  tilemap,   // Tilemap
  separation // ISeparation<TVector2>
) {...};

const dynamicResponse: TCollisionDynamicResponse = function (
  entity,    // Entity
  entity,    // Entity
  separation // ISeparation<number>
) {...};
```

## Entities

Built-in addon updating traits of each entity.

```ts
const entities = new Entities<TAddons, TTraits, TEvents>(
  scene // Scene<TAddons, TEvents>
);
```

```ts
// public interface
interface Entities
{
  public readonly children: Entity[];

  // adds one or many children
  public addChild(...elems: Entity[]): void;

  // removes one or many children
  public removeChild(...elems: Entity[]): void;

  // updates each child
  public update(deltaTime: number): void;

  // clears all children
  public destroy(): void;
}
```
