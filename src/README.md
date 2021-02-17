# Table of Contents

- Core Components
  - [BoundingBox](#boundingbox)
  - [Docker](#docker)
  - [Element](#element)
  - [Entity](#entity)
  - [Scene](#scene)
  - [Tilemap](#tilemap)
  - [Trait](#trait)
- [Built-in Addons](addons/README.md)
- [Tiled Map Editor](tiled/README.md)
- [User Inputs](inputs/README.md)

## BoundingBox

The `parent class` for the [Element](#element).

```ts
const bbox = new BoundingBox();
```

```ts
// public interface
interface BoundingBox
{
  public readonly min: TVector2;
  public readonly max: TVector2;
  public width: number;
  public height: number;
  public x: number;
  public y: number;
  public top: number;
  public bottom: number;
  public left: number;
  public right: number;
  public centerX: number;
  public centerY: number;

  // moves both min and max vectors by the given vector 
  public translate(vector: TVector2): void;

  // moves the x axis by the given value
  public translateX(value: number): void;

  // moves the y axis by the given value
  public translateY(value: number): void;

  // copies all fields from another bbox
  public copy(bbox: BoundingBox): void;

  // merges two or more other bboxes
  public merge(bboxes: ...BoundingBox[]): void;

  // returns true when given coordinates are inside bbox area
  public contains(x: number, y: number): boolean;

  // returns true when given bbox intersects with another one
  public intersects(bbox: BoundingBox, margin?: number = 0): boolean;
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

```ts
// public interface
interface Docker
{
  public readonly app: IApplication;
  public scene: Scene | null;

  // unmounts the current scene
  // and mounts the given one
  public mount(scene: Scene): void;

  // unmounts the current scene
  public unmount(): void;
}
```

## Element

It is a `subclass` of [BoundingBox](#boundingbox).

```ts
const element = new Element<TAddons, TEvents, TDisplay>(
  display, // TDisplay, e.g. Sprite or Container
);
```

```ts
// public interface
interface Element extends BoundingBox
{
  public name: string | null;
  public scene: Scene | null;
  public readonly display: TDisplay;

  // removes this element from the parent scene
  public destroy(): void;
}
```

## Entity

Basic component for dynamic objects of the [Scene](#scene). Each entity can be enriched with its own additional features via [Trait](#trait).

```ts
const entity = new Entity<TAddons, TTraits, TEvents>(
  display, // ISprite
  traits   // TTraits
);
```

It is a `subclass` of [Element](#element).

```ts
// public interface
interface Entity extends Element
{
  public static EMPTY = new Entity();
  public readonly type = 'entity';
  public readonly velocity: TVector2;
  public readonly traits: TTraits;

  // controls whether physics affects the rigidbody
  public physics: 'dynamic' | 'kinematic';

  // updates each trait and applies velocity
  public update(deltaTime: number): void;

  // destroys all traits and removes
  // the element from a parent scene
  public destroy(): void;
}
```

## Scene

Basic component for levels or in-game cutscenes. Functionality of the scene can be extended by `addons`.

```ts
import {Container} from 'pixi.js';

const scene = new Scene<TAddons, TEvents>(
  Container // IContainerConstructor
);
```

Inherits from an external [EventEmitter3](https://www.npmjs.com/package/eventemitter3) dependency with the default set of events that can be extended with custom ones. **Important:** the Scene removes all added listeners when destroyed.

```ts
'mount'
'unmount'
'elementAdded'
'elementRemoved'
```

```ts
// public interface
interface Scene extends EventEmitter
{
  public readonly addons: TAddons;
  public readonly graphics: IContainer;
  public readonly foreground: IContainer;
  public readonly background: IContainer;

  // should be called in the constructor before
  // accessing any addons of the current scene
  public registerAddons(addons: TAddons): void;

  // adds one or many elements
  public addElement(...elems: Element[]): void;

  // removes one or many elements
  public removeElement(...elems: Element[]): void;

  // updates registered addons and perform the actual
  // removal of garbage collected elements
  public update(deltaTime: number): void;

  // clears all added events and destroys addons
  // and elements removing them from the renderer
  public destroy(): void;
}
```

## Tilemap

Basic component for static objects of the [Scene](#scene).

```ts
const tilemap = new Tilemap<TAddons, TEvents>(
  display, // IContainer,
  values,  // number[],
  columns, // [optional] number = 8,
  tileSize // [optional] number = 32
);
```

It is a `subclass` of [Element](#element).

```ts
// public interface
interface Tilemap extends Element
{
  public readonly type = 'tilemap';
  public readonly values: number[];
  public readonly columns: number;
  public readonly tileSize: number;
  public readonly tileBounds: BoundingBox;

  // iterates over the linear array of values
  // and map them with returned sprite
  public assign(
    iteratee: (
      value: number,
      col: number,
      row: number
    ) => ISprite
  ): void;

  // deletes value and assigned sprite for the given index
  public delete(index: number): void;

  // returns column and row tuple for the given
  // index of value from a linear array
  public getPoint(index: number): TVector2;

  // returns index of value from a linear
  // array for the given column and row
  public getIndex(col: number, row: number): number;

  // returns array of nearest values
  public closest(col: number, row: number): number[];

  // returns distance between two points A and B;
  // returns a negative value as the distance to
  // the obstacle between A and B
  public raytrace(
    col0: number,
    row0: number,
    col1: number,
    row1: number
  ): number;

  // clears all children and removes
  // the element from a parent scene
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
