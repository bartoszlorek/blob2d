# Common Utilities

## Table of Contents

- [Array](#array)
- [Device](#device)
- [Easing](#easing)
- [Math](#math)
- [RAF](#raf)

## Array

```ts
// returns an element wrapped in an array
// or unchanged when it's already an array
function refineArray<T>(arr: T | T[]): T[];

// combines two similar arrays
function concatArray<T>(arr1: T[], arr2: T[]): T[];

// removes an element from an array without generating garbage
function arrayRemove<T>(arr: T[], item: T): boolean;
```

## Device

```ts
function isTouchDevice(): boolean;
```

## Easing

Set of easing functions for a smooth motion. https://matthewlein.com/tools/ceaser

```ts
linear

// quadratic functions
easeInQuad
easeOutQuad
easeInOutQuad

// cubic functions
easeInCubic
easeOutCubic
easeInOutCubic

// quartic functions
easeInQuart
easeOutQuart
easeInOutQuart

// quintic functions
easeInQuint
easeOutQuint
easeInOutQuint

// elastic functions
easeInElastic
easeOutElastic
easeInOutElastic
```

## Math

```ts
// linear interpolation between two values
function lerp(
  start: number,    // returned when bias = 0
  end: number,      // returned when bias = 1
  bias: number,     // [0-1] interpolation between start and end
  error: number = 0 // snaps bias to the start or end
): number;

// returns the sign of the number. It indicates whether
// the given number is positive, negative or zero.
function sign(value: number): -1 | 0 | 1;

// returns a random integer number between minimum
// (inclusive) and maximum (inclusive) values
function randomInt();                         // 0-1
function randomInt(max: number);              // 0-max
function randomInt(min: number, max: number); // min-max

// returns a random float number between minimum
// (inclusive) and maximum (inclusive) values.
function randomFloat();                         // 0-1
function randomFloat(max: number);              // 0-max
function randomFloat(min: number, max: number); // min-max
```

## RAF

Timing methods based on `window.requestAnimationFrame()` which tells the browser to call specified function before the next repaint.

https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame

```ts
// similar to the native setTimeout in JavaScript
function setFrameTimeout(
  callback: () => void,
  delay: number = 0
): IAnimationFrameRequest;

// similar to the native setInterval in JavaScript
function setFrameInterval(
  callback: () => void,
  delay: number = 0
): IAnimationFrameRequest;

// clears the methods above
function clearFrameRequest(
  request: IAnimationFrameRequest | void
): void;
```
