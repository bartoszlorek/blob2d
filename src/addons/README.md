# Built-in Addons

Addons provide a way to extend `Scene` with additional functionality, like animation, physics, or updating `Traits`.

## Table of Contents

- [Animation](#animation)
- [Collisions](#collisions)
- [Entities](#entities)

## Animation

```ts
const keyframes: IKeyframesDictionary<TKeys> = {
  player_jump: {firstGID: 1, lastGID: 4},
  player_move: {firstGID: 5, lastGID: 10},
};

const animation = new Animation<TAddons, TEvents, TKeys>(
  scene,            // Scene<TAddons, TEvents>,
  spritesheet,      // TiledSpriteSheet,
  keyframes,        // IKeyframesDictionary<TKeys>,
  deltaTimePerFrame // [optional] number = 1/12
);
```

```ts
// public interface
interface Animation
{
  public readonly playing: Map<ISprite, TKeys>;
  public readonly spritesheet: TiledSpriteSheet;
  public readonly keyframes: IKeyframesDictionary<TKeys>;

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

## Collisions

Built-in addon for arcade collision detection. Handles entity-entity and entity-tilemap collisions.

```ts
const collisions = new Collisions<TAddons, TTraits, TEvents>(
  scene // Scene<TAddons, TEvents>
);
```

### Collision Response

The function passed to the collision detection method that determines what should happen when two objects collide. It takes three arguments: two colliders and separation object.

```ts
interface ISeparation {
  magnitude: TVector2 | number;
  normal: TVector2;
}
```

**Hint:** Pass a custom function that won't change the velocity of colliding objects if you just want to detect a collision without actually responding to it.

```ts
// public interface
interface Collisions
{
  public readonly groups: ICollisionGroup[];

  // built-in response for a static collision
  static staticResponse(
    entity: Entity,
    tilemap: Tilemap,
    separation: ISeparation<TVector2>
  ): void;

  // built-in response for a dynamic collision
  static dynamicResponse(
    entityA: Entity,
    entityB: Entity,
    separation: ISeparation<number>
  ): void;

  // handles an entity-tilemap collision group
  public addStatic(
    entities: Entity | Entity[],
    tilemaps: Tilemap | Tilemap[],
    response: TCollisionStaticResponse
  ): void;

  // handles an entity-entity collision group
  public addDynamic(
    entitiesA: Entity | Entity[],
    entitiesB: Entity | Entity[],
    response: TCollisionDynamicResponse
  ): void;

  // handles an entity-entity collision group where
  // each element should collide with each other
  public addSelfDynamic(
    entities: Entity[],
    response: TCollisionDynamicResponse
  ): void;

  // resolves collisions groups at each game tick
  public update(deltaTime: number): void;

  // clears groups data 
  public destroy(): void;
}
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
