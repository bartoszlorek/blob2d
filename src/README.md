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
- [Built-in Addons](/addons#built-in-addons)
- User Inputs
  - [Keyboard](#keyboard)
  - [ScreenButton](#screenbutton)
- Motion Helpers
  - [Easing](#easing)

## BoundingBox

The `parent class` for the [Element](#element).

```ts
const bbox = new BoundingBox(
  min, // [optional] TVector2 = [0, 0]
  max  // [optional] TVector2 = [0, 0]
);
```

```ts
// public interface
interface BoundingBox
{
  public readonly min: TVector2;
  public readonly max: TVector2;
  public width: number;
  public height: number;
  public top: number;
  public bottom: number;
  public right: number;
  public x: number;
  public y: number;

  // moves both min and max vectors by a given vector 
  public translate(vector: TVector2): void;

  // moves the x axis by a given value
  public translateX(value: number): void;

  // moves the y axis by a given value
  public translateY(value: number): void;

  // returns true when given coordinates are inside bbox area
  public contains(x: number, y: number): boolean;

  // returns true when given bbox intersects with another one
  public intersects(bbox: BoundingBox, margin?: number = 0): boolean;

  // copies all fields from another one
  public copy(bbox: BoundingBox): void;
}
```

## Docker

It is a bridge between the [Scene](#scene) and the [PixiJS](https://www.pixijs.com/) Application.

```ts
import {Application} from 'pixi.js';

const app = new Application();
const docker = new Docker<TAddons, TEvents>(
  app // IApplication
);
```

Extends external [EventEmitter](#eventemitter) dependency and provides own events:

```ts
'docker/mount';
'docker/unmount';
```

```ts
// public interface
interface Docker extends EventEmitter
{
  public scene: Scene | null;

  // unmounts the current scene
  // and mounts the given one
  public mount(scene: Scene): void;

  // unmounts the current scene
  public unmount(): void;

  // removes all added events
  // and unmounts the current scene
  public destroy(): void;
}
```

## Element

It is a `subclass` of [BoundingBox](#boundingbox).

```ts
const element = new Element<TAddons, TEvents, TDisplay>(
  display, // TDisplay, e.g. Sprite or Container
  min,     // [optional] TVector2 = [0, 0]
  max      // [optional] TVector2 = [0, 0]
);
```

```ts
// public interface
interface Element extends BoundingBox
{
  public readonly display: TDisplay;
  public scene: Scene<TAddons, TEvents> | null;
  public name: string | null;

  // updates display object from bbox position
  public updateDisplayPosition(): void;

  // removes this element from the parent scene
  public destroy(): void;
}
```

## Entity

Basic component for dynamic objects of the [Scene](#scene). The entity can be extended with additional functionality by [Trait](#trait). It is a `subclass` of [Element](#element).

```ts
const entity = new Entity<TAddons, TTraits, TEvents>(
  display, // ISprite
  traits   // TTraits
);
```

```ts
// public interface
interface Entity extends Element
{
  static EMPTY = new Entity();
  public readonly type = 'entity';
  public velocity: TVector2;
  public trait: TTraits;

  // updates each trait and applies velocity
  public update(deltaTime: number): void;

  // clears traits data
  public destroy(): void;
}
```

## EventEmitter

External dependency [EventEmitter3](https://www.npmjs.com/package/eventemitter3) and a `parent class` for [Docker](#docker) and [Scene](#scene). **Important:** both Docker and Scene remove all added listeners when destroyed.

```ts
const emitter = new EventEmitter<TEvents>();
```

## Scene

Basic component for levels or in-game cutscenes. It is a `subclass` of [EventEmitter](#eventemitter). Functionality of the scene can be extended by `addons`.

```ts
import {Container} from 'pixi.js';

const scene = new Scene<TAddons, TEvents>(
  Container // IContainerConstructor
);
```

Extends external [EventEmitter](#eventemitter) dependency and provides own events:

```ts
'scene/addElement';
'scene/removeElement';
'scene/destroy';
```

```ts
// public interface
interface Scene extends EventEmitter
{
  public addon: TAddons;
  public graphics: IContainer;

  // should be called in the constructor before
  // accessing any addons of the current scene
  public registerAddons(addons: TAddons): void;

  // add one or many elements
  public addElement(...elems: Element[]): void;

  // removes one or many elements
  public removeElement(...elems: Element[]): void;

  // updates registered addons and perform the actual
  // removal of garbage collected elements
  public update(deltaTime: number): void;

  // clears all added events and addons
  // and removes elements from the renderer
  public destroy(): void;
}
```

## Tilemap

Basic component for static objects of the [Scene](#scene). It is a `subclass` of [Element](#element).

```ts
const tilemap = new Tilemap<TAddons, TEvents>(
  display, // IContainer,
  values,  // number[],
  columns, // [optional] number = 8,
  tilesize // [optional] number = 32
);
```

```ts
// public interface
interface Tilemap extends Element
{
  public readonly type = 'tilemap';
  public readonly values: number[];
  public readonly tilesize: number;
  public readonly columns: number;
  public readonly actualBounds: BoundingBox;

  // iterates over the grid of values
  // and map them with returned sprite
  public fill(
    iteratee: (
      value: number,
      x: number,
      y: number
    ) => ISprite
  ): void;

  // updates position of the entire container
  public setPosition(x: number, y: number): void;

  // returns index of tile for the given x and y
  public getIndex(x: number, y: number): number;

  // returns position of tile for the given index
  public getPoint(index: number): TVector2;

  // removes tile for a given index
  public removeByIndex(index: number): void;

  // caches the entire container
  public updateCache(): void;

  // returns values of nearest tiles
  public closest(x: number, y: number): number[];

  // returns distance between two points A and B;
  // returns a negative value as the distance to
  // the obstacle between A and B
  public raytrace(x0: number, y0: number, x1: number, y1: number): number;

  // clears all tile data
  public destroy(): void;
}
```

## Trait

Provides a way to extends the functionality of [Entity](#entity).

```ts
const trait = new Trait<TAddons, TTraits, TEvents>();
```

```ts
// public interface
interface Trait
{
  public entity: Entity;

  // it can be utilized by a subclass trait
  // for a particular functionality
  public update(deltaTime: number): void;

  // invoked by a parent entity when destroyed
  public destroy(): void;
}
```

## Keyboard

Proxy of keyboard events handling both `keyup` and `keydown` state.

```ts
const keyboard = new Keyboard<TKey>();

keyboard.on('ArrowRight', (pressed: boolean) => {
  if (pressed) player.moveRight();
});

keyboard.off('ArrowRight');
keyboard.destroy(); // for a cleanup
```

## ScreenButton

Simulates clicking a physical keyboard.

```ts
const $node = document.querySelector<HTMLElement>('.button');
const button = new ScreenButton<TKey>('ArrowLeft', $node);

// optional: extends button behavior
button.onKeydown = node => node.classList.add('clicked');
button.onKeyup = node => node.classList.remove('clicked');

// listens to the standard key event
keyboard.on('ArrowLeft', callback);
```

## Easing

Match the best easing type for your animation. https://matthewlein.com/tools/ceaser

```ts
const value = Easing.easeInQuad(time);

// or create an instance
const easing = new Easing(250); // milliseconds
const value = easing.easeInQuad(deltaTime);
```
