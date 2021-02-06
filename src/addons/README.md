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
  public readonly deltaTimePerFrame: number;
  public readonly playing: Map<ISprite, TKeys>;
  public spritesheet: TiledSpriteSheet;
  public keyframes: IKeyframesDictionary<TKeys>;

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

This is the callback function passed to the collision detection method that determines what should happen when two objects collide. The function takes three arguments: two colliders a separation object.

```ts
type TSeparation = {
  length: TVector2 | number;
  normal: TVector2;
}
```

**Hint:** Pass a custom function that won't change velocity of colliding object when you want to just detect collision without actual responding to it.

```ts
// public interface
interface Collisions
{
  // built-in response for a static collision.
  static staticResponse(
    entity: Entity,
    tilemap: Tilemap,
    separation: TSeparation<TVector2>
  ): void;

  // built-in response for a dynamic collision.
  static dynamicResponse(
    entityA: Entity,
    entityB: Entity,
    separation: TSeparation<number>
  ): void;

  // handles an entity-tilemap collision group
  public addStatic(
    entities: Entity | Entity[],
    tilemaps: Tilemap | Tilemap[],
    callback: (
      entity: Entity,
      tilemap: Tilemap,
      separation: TSeparation<TVector2>
    ) => void
  ): void;

  // handles an entity-entity collision group
  public addDynamic(
    entitiesA: Entity | Entity[],
    entitiesB: Entity | Entity[],
    callback: (
      entityA: Entity,
      entityB: Entity,
      separation: TSeparation<number>
    ) => void
  ): void;

  // handles an entity-entity collision group where
  // each element should collide with each other
  public addSelfDynamic(
    entities: Entity[],
    callback: (
      entityA: Entity,
      entityB: Entity,
      separation: TSeparation<number>
    ) => void
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
