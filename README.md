# 🎮 Square Engine 🎛️

## Features [TODO]:

- Tiles
- Sprites (Entities with Traits)
- Collisions
- Animations
- Events
- Keyboard Inputs

## General Structure

<p align="center">
  <img width="500" src="https://user-images.githubusercontent.com/13873576/104199289-8e224380-5427-11eb-861f-20b5a12ef347.png">
</p>

- **Docker** is a facade for `PixiJS` application responsible for mounting and updating the `Scene` during each frame of the game cycle.

- **Scene** provides ground to initialize relationships between dynamics `Entities` and more static `Tiles`. One `Docker` can only mount one scene at a time. Unmounting the current `Scene` destroys all elements, relationships, or events belonging to it.

- **Addon** provides a way to extend `Scene` with additional functionality, like animation, physics, or updating `Traits`.

- **Entity** is a dynamic element of `Scene`, it's also known as "sprite" in other environments. Each `Entity` has its own `velocity` which can be affected by `Addons` or `Traits`.

- **Trait** provides a way to extend `Entity` with additional functionality, like movement caused by user input, or interaction with other `Entities` or `Tiles`.

- **Tile** is a static element of `Scene`. Basically always it's a group of `Tiles` on a grid with specific properties, like collision for `Entities` or purply visual aspects.
