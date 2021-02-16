# Blöb2D Game Engine 🎮

Playable demo 💾 available here https://bartoszlorek.pl/run/blob2d \
Package 📦 for new games here https://www.npmjs.com/package/blob2d

<p align="center">
  <img width="500" src="https://user-images.githubusercontent.com/13873576/106365055-4c543100-6333-11eb-8784-2c98eb845dc8.png">
</p>

## General Structure

- **Docker** is a facade for `PixiJS` application responsible for mounting and updating the `Scene` during each frame of the game cycle.

- **Scene** provides ground to initialize relationships between dynamics `Entities` and more static `Tiles`. One `Docker` can only mount one scene at a time. Unmounting the current `Scene` destroys all elements, relationships, or events belonging to it.

- **Addon** provides a way to extend `Scene` with additional functionality, like animation, physics, or updating `Traits`.

- **Entity** is a dynamic element of `Scene`, it's also known as "sprite" in other environments. Each `Entity` has its own `velocity` which can be affected by `Addons` or `Traits`.

- **Trait** provides a way to extend `Entity` with additional functionality, like movement caused by user input, or interaction with other `Entities` or `Tiles`.

- **Tile** is a static element of `Scene`. Basically always it's a group of `Tiles` on a grid with specific properties, like collision for `Entities` or purply visual aspects.

## Features 📝

- ✅ Scene based environment fed by game cycles
- ✅ Sprites described as bounding box with `position` and `velocity`
- ✅ Traits system extending the functionality of sprites
- ✅ Tiles structure with methods to interact with them
- ✅ Custom and predefined events related to game cycles
- ✅ Sprite sheets manager
- ✅ Tiled integration
- ✅ Collisions
- ✅ Animations
- ✅ User inputs
- ❌ User interface
- ✅ Motion easings
- 🤷‍♂️ General physics
- ❌ Sound

## Documentation 📑

[Avaible here](src/README.md)

## Basic Usage

First, create basic types for the core component of the engine.

```ts
// types.ts

import {CustomAddon} from './addons';
import {CustomTrait} from './traits';

export type Addons = {customAddon: CustomAddon};
export type Traits = {customTrait: CustomTrait};
export type Events = 'player/score' | 'player/die';
export type Keyframes = 'player/jump' | 'player/run';
```

Then create an Application and pass it to the `Docker`. From now on, you can mount and unmount different subclasses of `Scene` like a playable level or cutscene.

```ts
// game.ts

import {Docker} from 'blob2d';
import {Application} from 'pixi.js';
import {Level} from './Level';

const app = new Application();

loader.load(() => {
  const docker = new Docker<Addons, Events>(app);
  const level = new Level();
  docker.mount(level);
});
```

The `Scene` is a place where you can combine all parts of your game like addons, entities, tilemaps, etc. You can create multiple scenes with different functions of the game.

```ts
// Level.ts

import {Entities, Entity, Scene} from 'blob2d';
import {Sprite, Container} from 'pixi.js';
import {CustomAddon} from './addons';
import {CustomTrait} from './traits';

export class Level extends Scene<Addons, Events> {
  constructor() {
    super(Container);

    // addons should be registered before
    // calling them later in the code
    this.registerAddons({
      customAddon: new CustomAddon(this),
    });

    // create a player with traits
    const player = new Entity<Addons, Traits, Events>(
      new Sprite(texture), {customTrait: new CustomTrait()}
    );

    // add a player to the scene
    this.addElement(player);

    // add a player to the addon
    this.addons.customAddon.addChild(player);
  }
}
```
