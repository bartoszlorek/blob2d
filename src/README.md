# Table of Contents

- Core Components
  - [BoundingBox](#boundingbox)
  - [Docker](#docker)
  - [Element](#element)
  - [Entity](#entity)
  - [EventEmitter](#eventemitter)
  - [Scene](#scene)
  - [Tilemap](#tilemap)
  - [Trait](#trait)
- Built-in Addons
  - [Animation](#animation)
  - [Collisions](#collisions)
  - [Entities](#entities)
- User Inputs
  - [Keyboard](#keyboard)
  - [ScreenButton](#screenbutton)
- Motion Helpers
  - [Easing](#easing)

## `BoundingBox`

The `parent class` for the [Element](#element).

```ts
const bbox = new BoundingBox([0, 0], [32, 32]); // min xy, max xy
```

```ts
interface BoundingBox {
  readonly min: TVector2;
  readonly max: TVector2;
  width: number;
  height: number;
  top: number;
  bottom: number;
  right: number;
  x: number;
  y: number;
  translate(vector: TVector2): void;
  translateX(value: number): void;
  translateY(value: number): void;
  contains(x: number, y: number): boolean;
  intersects(bbox: BoundingBox, margin?: number = 0): boolean;
  copy(bbox: BoundingBox): void;
}
```

## `Docker`

It is a bridge between the [Scene](#scene) and the [PixiJS](https://www.pixijs.com/) Application.

```ts
import {Application} from 'pixi.js';

const app = new Application();
const docker = new Docker<Addons, Events>(app);
```

Extends external [EventEmitter](#eventemitter) dependency and provides own events:

```ts
'docker/mount';
'docker/unmount';
```

```ts
interface Docker extends EventEmitter {
  scene: Scene | null;
  mount(scene: Scene): void;
  unmount(): void;
  destroy(): void;
}
```

## `Element`

It is a `subclass` of [BoundingBox](#boundingbox).

```ts
// e.g. PixiJS Sprite or Container is the DisplayObject
const element = new Element<Addons, Events, DisplayObject>(display);
```

```ts
interface Element extends BoundingBox {
  readonly display: TDisplay;
  scene: Scene | null;
  name: string | null;
  updateDisplayPosition(): void;
  destroy(): void;
}
```

## `Entity`

Basic component for dynamic objects of the [Scene](#scene). The entity can be extended with additional functionality by [Trait](#trait). It is a `subclass` of [Element](#element).

```ts
const entity = new Entity<Addons, Traits, Events>(sprite);
```

```ts
interface Entity extends Element {
  readonly type = 'entity';
  velocity: TVector2;
  trait: ITraitDictionary;
  update(deltaTime: number): void;
  destroy(): void;
}
```

## `EventEmitter`

External dependency [EventEmitter3](https://www.npmjs.com/package/eventemitter3) and a `parent class` for [Docker](#docker) and [Scene](#scene). **Important:** both Docker and Scene remove all added listeners when destroyed.

```ts
const emitter = new EventEmitter<Events>();
```

## `Scene`

Basic component for levels or in-game cutscenes. It is a `subclass` of [EventEmitter](#eventemitter). Functionality of the scene can be extended by `addons`.

```ts
import {Container} from 'pixi.js';

const scene = new Scene<Addons, Events>(Container);
```

Extends external [EventEmitter](#eventemitter) dependency and provides own events:

```ts
'scene/addElement';
'scene/removeElement';
'scene/destroy';
```

```ts
interface Scene extends EventEmitter {
  addon: TAddons;
  graphics: IContainer;
  registerAddons(addons: TAddons): void;
  addElement(...elems: Element[]): void;
  removeElement(...elems: Element[]): void;
  update(deltaTime: number): void;
  destroy(): void;
}
```

## `Tilemap`

Basic component for static objects of the [Scene](#scene). It is a `subclass` of [Element](#element).

```ts
const tilemap = new Tilemap<Addons, Events>(container, values);
```

```ts
interface Tilemap extends Element {
  readonly type = 'tilemap';
  readonly values: number[];
  readonly tilesize: number;
  readonly columns: number;
  readonly actualBounds: BoundingBox;

  setPosition(x: number, y: number): void;
  getIndex(x: number, y: number): number;
  getPoint(index: number): TVector2;
  removeByIndex(index: number): void;
  updateCache(): void;

  // maps DisplayObject to the grid of values
  fill(
    iteratee: (value: number, x: number, y: number) => ISprite
  ): void;

  // returns values of nearest tiles
  closest(x: number, y: number): number[];

  // returns distance between two points A and B;
  // returns a negative value as the distance to
  // the obstacle between A and B
  raytrace(x0: number, y0: number, x1: number, y1: number): number;

  destroy(): void;
}
```

## `Trait`

Provides a way to extends the functionality of [Entity](#entity).

```ts
const trait = new Trait<Addons, Traits, Events>();
```

```ts
interface Trait {
  entity: Entity;
  update(deltaTime: number): void;
  destroy(): void;
}
```

## `Animation`

```ts
const keyframes = {
  player_move: {firstGID: 1, lastGID: 4},
};

const animation = new Animation(scene, spritesheet, keyframes);
```

```ts
interface Animation {
  readonly deltaTimePerFrame: number;
  readonly playing: Map<ISprite, TKeys>;
  spritesheet: TiledSpriteSheet;
  keyframes: IKeyframesDictionary<TKeys>;


  addStatic(
    entities: Entity | Entity[],
    tilemaps: Tilemap | Tilemap[],
    callback: (
      entity: Entity,
      tilemap: Tilemap,
      separation: TVector2
    ) => boolean
  ): void;

  addDynamic(
    entitiesA: Entity | Entity[],
    entitiesB: Entity | Entity[],
    callback: (
      entityA: Entity,
      entityB: Entity,
      separation: TVector2
    ) => boolean
  ): void;

  addSelfDynamic(
    entities: Entity[],
    callback: (
      entityA: A,
      entityB: A,
      separation: TVector2
    ) => boolean
  ): void;

  update(deltaTime: number): void;
  destroy(): void;
}
```

## `Collisions`

Built-in addon for arcade collision detection. Handles entity-entity and entity-tilemap collisions.

```ts
new Collisions<Addons, Traits, Events>(scene);
```

```ts
interface Collisions {
  addStatic(
    entities: Entity | Entity[],
    tilemaps: Tilemap | Tilemap[],
    callback: (
      entity: Entity,
      tilemap: Tilemap,
      separation: TVector2
    ) => boolean
  ): void;

  addDynamic(
    entitiesA: Entity | Entity[],
    entitiesB: Entity | Entity[],
    callback: (
      entityA: Entity,
      entityB: Entity,
      separation: TVector2
    ) => boolean
  ): void;

  addSelfDynamic(
    entities: Entity[],
    callback: (
      entityA: A,
      entityB: A,
      separation: TVector2
    ) => boolean
  ): void;

  update(deltaTime: number): void;
  destroy(): void;
}
```

## `Entities`

Built-in addon updating [traits](#trait) of each entity.

```ts
new Entities<Addons, Traits, Events>(scene);
```

```ts
interface Entities {
  addChild(...elems: Entity[]): void;
  removeChild(...elems: Entity[]): void;
  update(deltaTime: number): void;
  destroy(): void;
}
```

## `Keyboard`

Proxy of keyboard events handling both `keyup` and `keydown` state.

```ts
const keyboard = new Keyboard();

keyboard.on('ArrowRight', (pressed: boolean) => {
  if (pressed) player.moveRight();
});

keyboard.off('ArrowRight');
keyboard.destroy();
```

## `ScreenButton`

Simulates clicking a physical keyboard.

```ts
const $node = document.querySelector<HTMLElement>('.button');
const button = new ScreenButton('ArrowLeft', $node);

// optional: extends button behavior
button.onKeydown = node => node.classList.add('clicked');
button.onKeyup = node => node.classList.remove('clicked');

// listens to the standard key event
keyboard.on('ArrowLeft', callback);
```

## `Easing`

Match the best easing type for your animation. https://matthewlein.com/tools/ceaser

```ts
const value = Easing.easeInQuad(time);

// or create an instance
const easing = new Easing(250); // milliseconds
const value = easing.easeInQuad(deltaTime);
```
